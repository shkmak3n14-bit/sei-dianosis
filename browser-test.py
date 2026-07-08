import json
import sys
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8765"

TESTS = [
    {
        "name": "index",
        "url": f"{BASE}/index.html",
        "checks": [
            ("#start-diagnosis", "exists"),
        ],
        "actions": [],
        "after": [],
    },
    {
        "name": "diagnosis",
        "url": f"{BASE}/diagnosis.html",
        "checks": [
            ("#diagnosis-form", "exists"),
            ("#total-count", "text_not_empty"),
            ("#diagnosis-form fieldset.type-section", "count_gte:9"),
            ("#diagnosis-form input[type=radio]", "count_gte:100"),
        ],
        "actions": [],
        "after": [],
    },
    {
        "name": "diagnosis_preview",
        "url": f"{BASE}/diagnosis.html?previewType=3",
        "checks": [
            ("#diagnosis-result", "visible"),
            ("#result-summary", "contains:プレビュー"),
            ("#diagnosis-form", "hidden"),
        ],
        "actions": [],
        "after": [],
    },
    {
        "name": "wing_no_state",
        "url": f"{BASE}/w.html",
        "checks": [
            ("#w-summary", "contains:診断結果が見つかりません"),
        ],
        "actions": [],
        "after": [],
    },
    {
        "name": "wing_learn_default",
        "url": f"{BASE}/wing-learn.html",
        "checks": [
            ("#wing-learn-content", "contains:上のリンクからウイングを選んでください"),
        ],
        "actions": [],
        "after": [],
    },
    {
        "name": "wing_learn_9w1",
        "url": f"{BASE}/wing-learn.html?wing=9w1",
        "checks": [
            ("#wing-learn-content .wing-learn-title", "contains:ウイング1"),
            ("#nav-9w1.is-active", "exists"),
        ],
        "actions": [],
        "after": [],
    },
]


def run_check(page, selector, rule):
    locator = page.locator(selector)

    if rule == "exists":
        if locator.count() == 0:
            return False, f"missing: {selector}"
        return True, "ok"

    if rule == "hidden":
        if locator.count() == 0:
            return False, f"missing: {selector}"
        if not locator.first.is_hidden():
            return False, f"expected hidden: {selector}"
        return True, "ok"

    if rule == "visible":
        if locator.count() == 0:
            return False, f"missing: {selector}"
        if not locator.first.is_visible():
            return False, f"expected visible: {selector}"
        return True, "ok"

    if rule == "text_not_empty":
        if locator.count() == 0:
            return False, f"missing: {selector}"
        text = locator.first.inner_text().strip()
        if not text:
            return False, f"empty text: {selector}"
        return True, f"text={text}"

    if rule.startswith("contains:"):
        expected = rule.split(":", 1)[1]
        if locator.count() == 0:
            return False, f"missing: {selector}"
        text = locator.first.inner_text()
        if expected not in text:
            return False, f"expected '{expected}' in '{text[:120]}'"
        return True, "ok"

    if rule.startswith("count_gte:"):
        minimum = int(rule.split(":", 1)[1])
        count = locator.count()
        if count < minimum:
            return False, f"expected >= {minimum}, got {count} for {selector}"
        return True, f"count={count}"

    return False, f"unknown rule: {rule}"


def main():
    results = []
    console_errors = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.on("pageerror", lambda err: console_errors.append(str(err)))
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        for test in TESTS:
            test_result = {"name": test["name"], "passed": True, "checks": [], "url": test["url"]}
            page.goto(test["url"], wait_until="networkidle")

            for selector, rule in test["checks"]:
                ok, detail = run_check(page, selector, rule)
                test_result["checks"].append({"selector": selector, "rule": rule, "ok": ok, "detail": detail})
                if not ok:
                    test_result["passed"] = False

            results.append(test_result)

        # Flow test: seed diagnosis state then open wing page
        flow_result = {"name": "wing_with_seeded_state", "passed": True, "checks": [], "url": f"{BASE}/w.html"}
        page.goto(f"{BASE}/diagnosis.html", wait_until="networkidle")
        page.evaluate(
            """() => {
                const state = {
                    scores: [
                        { type: 9, name: "平和を求める人", score: 60, max: 60, normalized: 1 },
                        { type: 8, name: "挑戦する人", score: 40, max: 60, normalized: 0.67 }
                    ],
                    answers: [],
                    selectedRankIndex: 0
                };
                sessionStorage.setItem('sieDiagnosisState', JSON.stringify(state));
            }"""
        )
        page.goto(f"{BASE}/w.html", wait_until="networkidle")

        flow_checks = [
            ("#w-summary", "contains:タイプ9"),
            ("#wing-form fieldset.type-section", "count_gte:2"),
            ("#wing-intro", "contains:9w8"),
        ]
        for selector, rule in flow_checks:
            ok, detail = run_check(page, selector, rule)
            flow_result["checks"].append({"selector": selector, "rule": rule, "ok": ok, "detail": detail})
            if not ok:
                flow_result["passed"] = False

        results.append(flow_result)
        browser.close()

    passed = sum(1 for item in results if item["passed"])
    total = len(results)

    print("=== Browser verification ===")
    for item in results:
        status = "PASS" if item["passed"] else "FAIL"
        print(f"[{status}] {item['name']} ({item['url']})")
        for check in item["checks"]:
            mark = "  ok" if check["ok"] else "  NG"
            print(f"{mark} {check['selector']} ({check['rule']}): {check['detail']}")

    if console_errors:
        print("\n=== Console / page errors ===")
        for err in console_errors:
            print(err)
    else:
        print("\nNo console/page errors detected.")

    print(f"\nSummary: {passed}/{total} scenarios passed")
    return 0 if passed == total and not console_errors else 1


if __name__ == "__main__":
    raise SystemExit(main())

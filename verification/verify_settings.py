from playwright.sync_api import sync_playwright, expect
import time

def verify_settings(page):
    # 1. Register
    page.goto("http://localhost:8080/")
    # Expect redirect to register
    expect(page).to_have_url("http://localhost:8080/register")

    # Fill register form
    page.fill("input[name='username']", "admin")
    page.fill("input[name='password']", "password123")
    page.fill("input[name='confirmPassword']", "password123")
    page.click("button[type='submit']")

    # Wait for login/dashboard - logic: register autologs in or redirects to login?
    # Memory says: "The frontend handles the 'auto-login' requirement by chaining a login request immediately after a successful register request."
    # So we should end up at dashboard.
    page.wait_for_url("http://localhost:8080/dashboard")
    expect(page.locator("mat-card-title")).to_have_text("ダッシュボード")

    # 2. Navigate to Settings
    # There should be a "設定" (Settings) button in the header.
    page.click("text=設定")
    expect(page).to_have_url("http://localhost:8080/settings")
    expect(page.get_by_text("システム設定")).to_be_visible()

    # 3. Change Color
    # Initial color is #3f51b5
    # Let's change it to a distinct color, e.g., #FF5733 (Orange/Red)
    # We have both a text input and a color picker.
    # Text input inside mat-form-field
    input_locator = page.locator("input[placeholder='#000000']")
    input_locator.fill("#FF5733")

    # Click Save
    page.click("button:has-text('保存')")

    # Verify Snackbar
    expect(page.get_by_text("テーマ設定を保存しました")).to_be_visible()

    # 4. Verification
    # Take screenshot
    time.sleep(1) # wait for color application
    page.screenshot(path="verification/settings_page_v2.png")

    # Check if style tag exists and has correct content
    # We specifically want to check for new surface container variables
    style_content = page.evaluate("document.getElementById('custom-theme-styles').textContent")
    print(f"Style Content length: {len(style_content)}")

    required_vars = [
        "--mat-sys-primary",
        "--mat-sys-surface-container",
        "--mat-sys-surface-dim",
        "--mat-sys-surface-bright"
    ]

    for var in required_vars:
        if var not in style_content:
            raise Exception(f"Missing variable: {var}")

    # 5. Reload and verify persistence
    page.reload()
    expect(page.get_by_text("システム設定")).to_be_visible()
    # Check input value
    expect(input_locator).to_have_value("#FF5733")

    print("Verification passed!")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_settings(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_v2.png")
            raise e
        finally:
            browser.close()

from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    print("Navigating to register page...")
    page.goto("http://localhost:4200/register")
    print("Register page loaded.")
    page.screenshot(path="jules-scratch/verification/register-page.png")
    page.fill('input[name="username"]', 'testuser')
    page.fill('input[name="password"]', 'password')
    print("Registering user...")
    page.click('button[type="submit"]')
    print("User registered.")

    print("Waiting for login page...")
    page.wait_for_url("http://localhost:4200/login")
    print("Login page loaded.")
    page.screenshot(path="jules-scratch/verification/login-page.png")
    page.fill('input[name="username"]', 'testuser')
    page.fill('input[name="password"]', 'password')
    print("Logging in...")
    page.click('button[type="submit"]')
    print("Logged in.")

    print("Waiting for home page...")
    page.wait_for_url("http://localhost:4200/")
    print("Home page loaded.")
    page.screenshot(path="jules-scratch/verification/home-page.png")

    print("Navigating to protected page...")
    page.goto("http://localhost:4200/protected")
    page.wait_for_selector('app-protected')
    print("Protected page loaded.")
    page.screenshot(path="jules-scratch/verification/protected-page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

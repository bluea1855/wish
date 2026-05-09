from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:5174/")
    page.wait_for_timeout(1000)

    # Fill out the form
    page.get_by_label("Person's Name").fill("Final Test")
    page.wait_for_timeout(500)

    # Take screenshot of the new UI with theme previews
    page.screenshot(path="/home/jules/verification/screenshots/new_gift_ui.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()

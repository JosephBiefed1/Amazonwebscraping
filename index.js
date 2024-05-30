const puppeteer = require('puppeteer');
'use strict';
var fs = require('fs');

(async () => {
    const browser = await puppeteer.launch(
        {
            headless: false, 
            defaultViewport: false,
            userDataDir: './tmp'
            
        }
    );
    const page = await browser.newPage();

    await page.goto('https://www.amazon.sg/s?k=amazon+basic&crid=3F60HBUUCWFFD&sprefix=amazon+basi%2Caps%2C397&ref=nb_sb_noss_2');

    const productsHandles = await page.$$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item')
    let items = [];
    let isBtndisabled = true;
    while (isBtndisabled == true){
        for (const productsHandle of productsHandles) {
            
            let title = "Null";
            let price = "Null";
            let image = "Null";

            try {
            title = await page.evaluate((el) => el.querySelector("div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2 > a > span").textContent, productsHandle);
            }
            catch (error) {}
            try{
            price = await page.evaluate((el) => el.querySelector(".a-price > .a-offscreen").textContent, productsHandle);
            }
            catch (error) {}
            try{
            image = await page.evaluate((el) => el.querySelector(".s-image").getAttribute('src'), productsHandle);
            }
            catch (error) {}

            if (title != "Null"){
            items.push({title, price, image})
            fs.appendFile('results.csv', `${title.replace(/,/g, ".")},${price},${image}\n`, function (err) {
                if (err) throw err;
                console.log('Saved!');

            })
            }
        }
        await page.waitForSelector('span > a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator', {visible: true});

        const is_disabled = await page.$('span > a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator') != null;
        isBtndisabled = is_disabled
        if (isBtndisabled) {
            await page.click('span > a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator');
        }
    }
    browser.close()
})();

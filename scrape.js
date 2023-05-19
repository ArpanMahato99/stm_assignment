/*
    Write a Node.js program using Selenium to scrape the top 10 search results for a specific keyword and store the URLs in a JSON file.
    Assumption -> keyword will have only one word
*/

const { error } = require('console');
const fs = require('fs');
const webdriver = require('selenium-webdriver');
const url = 'https://www.google.com';

async function fetchData(keyword) {
  let driver = new webdriver.Builder().forBrowser('chrome').build();
  driver.manage().window().maximize();
  driver.get(url);

  try {
    // Navigate to the search engine website
    const searchInput = await driver.findElement(webdriver.By.xpath(`//*[@id="APjFqb"]`));
    await searchInput.sendKeys(keyword);
    await searchInput.sendKeys(webdriver.Key.RETURN);

    // Wait for the search results to load
    await driver.sleep(5000);
    // get all the urls provided by search engine
    const searchLinks = await driver.findElements(webdriver.By.css('#rcnt a'));

    // Extract URLs from the search result links haing the keyword
    const urls = [];
    for (const link of searchLinks) {
      const url = await link.getAttribute('href');
      if (url !== null && url.includes(keyword) && !url.includes("www.google.com/search")) {
        urls.push(url);
      }
    }

    // Extracting top 10 urls
    const top10Urls = urls.slice(0, 10);
    console.log(top10Urls);
    fs.writeFileSync(`${keyword}-links.json`, JSON.stringify(top10Urls,null,2));
    console.log('Search results scraped successfully.');
  } finally {
    driver.quit();
  }

}


const keyword = process.argv[2];
if (!keyword) {
  console.error("ERROR: Please provide a keyword");
  process.exit(1);
}

fetchData(keyword);
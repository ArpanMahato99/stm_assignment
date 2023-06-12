/*
    Write a Node.js program using Selenium to scrape the top 10 search results for a specific keyword and store the URLs in a JSON file.
    Assumption -> keyword will have only one word
*/

// Required dependencies
const fs = require('fs');
const webdriver = require('selenium-webdriver');
const { By, Key, until } = webdriver;
const url = 'https://www.google.com';

// Function to scrape the top 10 search results for a specific keyword and store the URLs in a JSON file
async function fetchData(keyword) {
  // Initialize the WebDriver
  let driver = new webdriver.Builder().forBrowser('chrome').build();
  driver.manage().window().maximize();
  driver.get(url);

  try {
    // Navigate to the search engine website and perform the search
    const searchInput = await driver.findElement(By.xpath(`//*[@id="APjFqb"]`));
    await searchInput.sendKeys(keyword);
    await searchInput.sendKeys(Key.RETURN);

    // Wait for the search results to load
    await driver.wait(until.elementLocated(By.css('#rcnt a')), 10000);
    // Get all the URLs provided by the search engine
    const searchLinks = await driver.findElements(By.css('#rcnt a'));

    // Extract URLs from the search result links that contain the keyword
    const urls = [];
    for (const link of searchLinks) {
      const url = await link.getAttribute('href');
      if (url !== null && url.includes(keyword) && !url.includes("www.google.com/search")) {
        urls.push(url);
      }
    }

    // Extract the top 10 URLs
    const result = {
      "keyword": keyword,
      "urls":{}
    };
    for(let i = 0; i < 10 && i < urls.length; i++) {
      result.urls[`${i+1}`] = urls[i];
    }
    //console.log(result);

    // Write the URLs to a JSON file
    fs.writeFileSync(`${keyword}-links.json`, JSON.stringify(result,null,2));
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
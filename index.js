
//==========================================UTILITY METHODS===========================================================================================

const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while(checkCounts++ <= maxChecks){
    let html = await page.content();
    let currentHTMLSize = html.length; 

    //let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

    //console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

    if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
      countStableSizeIterations++;
    else 
      countStableSizeIterations = 0; //reset the counter

    if(countStableSizeIterations >= minStableSizeIterations) {
      console.log("Fully Rendered Page: " + page.url());
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }  
};

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const safeHover = async (elem) => {
  await elem.evaluate((e) =>
    e.scrollIntoView({ block: "center", inline: "center" })
  );

  await elem.evaluate(e => e.click());
};

// Click Element and 
const clickElement = async (page,selector) => {
	const [element] = await page.$x(selector);
	await page.evaluate((pageItem)=> pageItem.scrollIntoView({ block: "center", inline: "center" }),element);
	await Promise.all([ 
		page.waitForNavigation({timeout: 30000, waitUntil: ['domcontentloaded','load', 'networkidle2']}),	
  		element.click(), // trigger a navigation
  		  
	]);
	
};

const safeClick = async (page,selector) => {
	const element = await page.waitForSelector(selector);
	await page.evaluate((pageItem)=> pageItem.scrollIntoView({ block: "center", inline: "center" }),element);
	await Promise.all([
		safeHover(element),  		  
	]);
	
};


const enterText = async (page,selector,textValue) => {
	const element = await page.waitForSelector(selector);
	await page.evaluate((pageItem)=> pageItem.scrollIntoView({ block: "center", inline: "center" }),element);
	await Promise.all([
		element.type(selector, textValue)
	]);
};


const handleDropDown = async (page,selector,dropDownOption) => {
	//identify dropdown then select an option by value
	await page.waitForSelector(selector);
   	const dropdown = await page.$(selector)
	await Promise.all([
		dropdown.select(dropDownOption), // select dropdown option
	]);

   //get value selected
   const value = await (await dropdown.getProperty("value")).jsonValue();
   console.log(value);	
};


//===============================================================================================================================================


async function captureReport() {

	const fs = require('fs')
	const puppeteer = require('puppeteer')
	const lighthouse = await import('lighthouse')


	const browser = await puppeteer.launch({headless: 'new', args: ['--allow-no-sandbox-job', '--allow-sandbox-debugging', '--no-sandbox', '--disable-gpu', '--disable-gpu-sandbox', '--display', '--ignore-certificate-errors', '--disable-storage-reset=true']});
	//const browser = await puppeteer.launch({"headless": false, defaultViewport: null, args: ['--start-maximized','--allow-no-sandbox-job', '--allow-sandbox-debugging', '--no-sandbox', '--ignore-certificate-errors', '--disable-storage-reset=true']});
	// get existing tab/page (first item in the array)
	const [page] = await browser.pages();	
	const baseURL = "http://localhost/";	
	await page.setDefaultTimeout(10000);
	await page.setViewport({"width":1920,"height":1080});
		
	const flow = await lighthouse.startFlow(page, {
		name: 'Performance testing Essentials - Application',
		configContext: {
		  settingsOverrides: {
			throttling: {
			  rttMs: 40,
			  throughputKbps: 10240,
			  cpuSlowdownMultiplier: 1,
			  requestLatencyMs: 0,
			  downloadThroughputKbps: 0,
			  uploadThroughputKbps: 0
			},
			throttlingMethod: "simulate",
			screenEmulation: {
			  mobile: false,
			  width: 1920,
			  height: 1080,
			  deviceScaleFactor: 1,
			  disabled: false,
			},
			formFactor: "desktop",
			onlyCategories: ['performance'],
		  },
		},
	});


  	
	//================================SELECTORS=====================================================================================


	const header_all_products = "//h1[contains(text(),'All Products')]";
	const link_table_tab = "//a[contains(@href,'http://localhost/tables')]";
	const header_tables = "//h1[contains(text(),'Tables')]";
	const link_living_room_table_8 = "//a[contains(@href,'http://localhost/products/living-room-table8')]";
	const header_living_room_table_8 = "//h1[contains(text(),'living room table8')]";
	const button_add_to_cart = "//button[contains(text(),'Add to Cart')]";
	const label_cart_confirmation = "//span[contains(text(),'Added! ')]";
	const link_cart_tab = "//a[contains(text(),'Cart')]";
	const header_cart = "//h1[contains(text(),'Cart')]";
	const button_cart_place_an_order = "//input[contains(@value,'Place an order')]";
	const header_checkout = "//h1[contains(text(),'Checkout')]";
	const button_checkout_place_order = "//input[contains(@value,'Place Order')]";
	const label_checkout_confirmation = "//h1[contains(text(),'Thank You')]";

	// Chekout Form Fields
	const form_textBox_billing_cart_company = "[name='cart_company']";
	const form_textBox_billing_cart_name = "[name='cart_name']";
	const form_textBox_billing_cart_address = "[name='cart_address']";
	const form_textBox_billing_cart_postal = "[name='cart_postal']";
	const form_textBox_billing_cart_city = "[name='cart_city']";
	const form_dropdown_billing_cart_country = "[name='cart_country']";
	const form_dropdown_billing_cart_state = "[name='cart_state']";
	const form_dropdown_billing_cart_state_xpath = "//select[@name='cart_state']";
	const form_textBox_billing_cart_phone = "[name='cart_phone']";
	const form_textBox_billing_cart_email = "[name='cart_email']";
	const form_textarea_billing_cart_comment = "[name='cart_comment']";

	const form_textBox_delivery_cart_s_company = "[name='cart_s_company']";
	const form_textBox_delivery_cart_s_name = "[name='cart_s_name']";
	const form_textBox_delivery_cart_s_address = "[name='cart_s_address']";
	const form_textBox_delivery_cart_s_postal = "[name='cart_s_postal']";
	const form_textBox_delivery_cart_s_city = "[name='cart_s_city']";
	const form_dropdown_delivery_cart_s_country = "[name='cart_s_country']";
	const form_dropdown_delivery_cart_s_state = "[name='cart_s_state']";
	const form_dropdown_delivery_cart_s_state_xpath = "//select[@name='cart_s_state']";
	const form_textBox_delivery_cart_s_phone = "[name='cart_s_phone']";
	const form_textBox_delivery_cart_s_email = "[name='cart_s_email']";
	const form_textarea_delivery_cart_s_comment = "[name='cart_s_comment']";


	//================================Launch Application===================================================================================

	const navigationPromise = page.waitForNavigation({timeout: 30000, waitUntil: ['domcontentloaded','load', 'networkidle2']});
	await page.goto(baseURL);    
  	await navigationPromise;

  	//Cold Navigation - No performance measuring
    await flow.navigate(baseURL, {
		stepName: 'Open the application'
	});


    await waitTillHTMLRendered(page);
    await page.$x(header_all_products);
  	console.log('Performance testing Essentials - Application Loaded');
	
	//================================PAGE_ACTIONS==========================================================================================

	await flow.startTimespan({ stepName: 'Navigate to \"Tables\" tab' });		
		clickElement(page, link_table_tab);
        await waitTillHTMLRendered(page);        
		await page.$x(header_tables);
    await flow.endTimespan();
    console.log('Tables page loaded');

    await flow.startTimespan({ stepName: 'Open a table product cart (click on a table)' });
    	clickElement(page, link_living_room_table_8);
        await waitTillHTMLRendered(page);
		await page.$x(header_living_room_table_8);
    await flow.endTimespan();
    console.log('Table product loaded');

    await flow.startTimespan({ stepName: 'Add table to Cart (click "Add to Cart" button)' });
        clickElement(page, button_add_to_cart);
        await waitTillHTMLRendered(page);
		await page.$x(label_cart_confirmation);
    await flow.endTimespan();
    console.log('Added table to cart');

    await flow.startTimespan({ stepName: 'Open \"Cart\" page' });
    	clickElement(page, link_cart_tab);
        await waitTillHTMLRendered(page);
		await page.$x(header_cart);
    await flow.endTimespan();
    console.log('Cart Page loaded');

    await flow.startTimespan({ stepName: 'Click \"Place an order\"' });
    	clickElement(page, button_cart_place_an_order);
        await waitTillHTMLRendered(page);
		await page.$x(header_checkout);
    await flow.endTimespan();
    console.log('Cart order placed');

    await flow.startTimespan({ stepName: 'Fill in all required fields, click \"Place order\"' });
    	enterText(page, form_textBox_billing_cart_company, "test company");
    	await page.type(form_textBox_billing_cart_name, "test name");
    	await page.type(form_textBox_billing_cart_address, "test address");
    	await page.type(form_textBox_billing_cart_postal, "733101");
    	await page.type(form_textBox_billing_cart_city, "test city");
    	handleDropDown(page, form_dropdown_billing_cart_country, "IN");
    	await delay(5000);
    	safeClick(page, form_dropdown_billing_cart_state);
    	handleDropDown(page, form_dropdown_billing_cart_state, "IN_WB");
    	await page.type(form_textBox_billing_cart_phone, "987654320");
    	await page.type(form_textBox_billing_cart_email, "test@email.com");
    	await page.type(form_textarea_billing_cart_comment, "test comment");

    	await page.type(form_textBox_delivery_cart_s_company, "test s company");
    	await page.type(form_textBox_delivery_cart_s_name, "test s name");
    	await page.type(form_textBox_delivery_cart_s_address, "test s address");
    	await page.type(form_textBox_delivery_cart_s_postal, "733102");
    	await page.type(form_textBox_delivery_cart_s_city, "test s city");
    	handleDropDown(page, form_dropdown_delivery_cart_s_country, "IN");
    	await delay(5000);
    	safeClick(page, form_dropdown_delivery_cart_s_state);
    	handleDropDown(page, form_dropdown_delivery_cart_s_state, "IN_WB");
    	await page.type(form_textBox_delivery_cart_s_phone, "987654321");
    	await page.type(form_textBox_delivery_cart_s_email, "test_s@email.com");
    	await page.type(form_textarea_delivery_cart_s_comment, "test s comment");

    	await Promise.all([ 
    		navigationPromise,
    		clickElement(page, button_checkout_place_order),
    		console.log("Place Order - Submitted"),   	
    	]);
    	waitTillHTMLRendered(page);
		page.$x(label_checkout_confirmation);
		console.log("Thank You Page")
		await delay(5000);
    await flow.endTimespan();
    console.log('Checkout completed');



	//================================REPORTING=============================================================================================

	const reportPath = __dirname + '/lighthouse-audit-report.html';
	const reportHtml  = await flow.generateReport();
	fs.writeFileSync(reportPath, reportHtml);	

  await browser.close();
}


captureReport();
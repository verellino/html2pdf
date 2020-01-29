const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const summary = require('./data/payoutSummary.json');
const booking = require('./data/getBookingListWithPayout.json');

// const compile = async function(templateName, summary, booking){
//     const filePath = path.join(process.cwd(), 'templates', 'monthly.hbs');
//     const html = await fs.readFile(filePath, 'utf-8');
//     return hbs.compile(html)(summary, booking);
// };

const summaryT = $("#summary").html();
const compileSum = hbs.compile(summaryT);   

(async function() {
    try{

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // const html = fs.readFileSync('./templates/monthly.html', 'utf8');
        const content = await compile('monthly', summary, booking);

        await page.setContent(content);
        await page.emulateMediaFeatures('screen');
        await page.pdf({
            path:'monthlyreport.pdf',
            format: 'A4',
            margin:{
                top: "5px",
                right: "5px",
                left: "5px",
                bottom: "5px"
            },
            printBackground: true
        });

        console.log('done');
        await browser.close();
        process.exit();

    }

    catch (e) {
        console.log('our error', e);
    }
})();
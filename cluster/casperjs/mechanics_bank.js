/**
 * Created by porter haet 10/26/16.
 * 695Q-FSOObdXAzqA191RHGiwetaAHSQ0PyYF4CKdoH8
 */

var casper = require('casper').create();
var system = require('system');
var mechanics_central =  require('../config/credentials/mechanics_central');

casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)')

function consoleRead() {
  return system.stdin.readLine();
}

var rftoken;

casper.options.waitTimeout = 45000;

casper.start('https://mechanicsbank.com/mechbank/Mbwebsite.nsf/home/index');

casper.wait(5000, function() {
    this.echo("Done waiting.");
});

casper.then(function() {

    this.echo('First Page: ' + this.getTitle());
    this.fill('form#Login',
      {
			'userid':mechanics_central.username,
			'password':mechanics_central.password
		},
    true);
});

count = 0;
casper.waitFor(function check() {
  if (count == 30) {
    count = 0;
    console.log(this.getTitle());
    console.log(this.getCurrentUrl());
  }
  count++;
	return this.getTitle().indexOf("Verify your identity") != -1
}, function then() {
  this.echo('Second Page: ' + this.getTitle());
  if (this.getTitle().indexOf("Verify your identity") != -1) {
    console.log("verifying identify");
    casper.waitForSelector('#\\(s_3528\\)sendOTP', function then() {
      this.mouseEvent('click', '#\\(s_3528\\)sendOTP', "20%", "50%");

      casper.waitForSelector('#otp-entry-field', function then() {
        console.log("text code: ");
        const code = consoleRead();
        casper.sendKeys('#otp-entry-field', code);
        this.mouseEvent('click', '#ifs-button-1012-btnEl', "20%", "50%");
        console.log('clicked');
      });
    });
  }
});

casper.waitFor(function check() {
  return this.getTitle() == "Home"
}, function then() {
  console.log("title is: " + this.getTitle());
});

casper.then(function() {
  this.wait(6000);
});

casper.thenOpen("https://www.mechanicsbankonline.com/tob/live/usp-core/sdp/com.diginsite.product.sdp.SDP/SDP.htm?usp=true", function () {
  console.log(this.getHTML());
  rftoken = this.evaluate(function() {
    return SDP.rftoken;
  });
  console.log(rftoken);
  const timeStamp = new Date().getTime();
  casper.thenOpen("https://www.mechanicsbankonline.com/tob/live/usp-core/sdp/app/ajax/history/dashboardSummary.json?_dc=" + timeStamp + "&rftoken=" + rftoken + "&isNHP=false&pageId=SDP", function () {
    var html = this.getHTML();
    html = html.substring(html.indexOf("{"));
    html = html.substring(0, html.lastIndexOf("}") + 1);
    const resp = JSON.parse(html);
    var accountId = resp.purchaseRewardsResponse[0].cbs2AccountId;
    console.log(accountId);
    casper.then(function() {
      console.log("downloading");
      this.download("https://www.mechanicsbankonline.com/tob/live/usp-core/sdp/app/ajax/history/transactionsQFX", casper.cli.args[0] + ".qfx", "POST", {
        rftoken: rftoken,
        locationId: "",
        accountId: accountId,
        dateRangeStart: "2016-10-01 00:00:00",
        dateRangeEnd: "2016-10-30 00:00:00",
        filteredTnums: "",
        selectedDateRange: "rangeThirty"
      });
    });
  });
});

casper.run();

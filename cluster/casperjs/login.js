/**
 * Created by david.bernadett on 7/8/16.
 */

var casper = require('casper').create();
casper.start('https://sccupcu.com/ISuite5/Features/Auth/MFA/Default.aspx');

casper.then(function() {
    this.echo('First Page: ' + this.getTitle());
    this.fill('form#aspnetForm',
        {'ctl01$Main1$UserIDTextbox':'SCCU292261'}
        ,false);
    this.mouseEvent('click', '#ctl01_Main1_LoginBtn', "20%", "50%");
});

casper.then(function() {
    this.echo('Second Page: ' + this.getTitle());
    var questionText = this.fetchText('#ctl01_Main1_QuestionTextLabel');
    var answerText;
    if(questionText.localeCompare("What is your mother's maiden name?") == 0){
        answerText = "thompson";

    } else if(questionText.localeCompare("In what year (YYYY) did you graduate from high school?") == 0) {
        answerText = "2014";
    } else if(questionText.localeCompare("In what city were you born? (Enter full name of city only)") == 0) {
        answerText = "test tube";
    } else {
        this.echo('New question is: ' + questionText);
        this.echo('aborting.');
        return;
    }
    this.echo('Question is: ' + questionText);
    this.echo('Answer is: ' + answerText);
    this.echo("before fill?");
    this.fill('form#aspnetForm',
        {'ctl01$Main1$AnswerTextbox':answerText}
        ,false);
    this.echo("before click?");
    this.mouseEvent('click', '#ctl01_Main1_SubmitBtn', "20%", "50%");
    this.echo("after click?");
});

casper.then(function() {
    this.echo("something?");
    this.echo('Third Page: ' + this.getTitle());
    this.fill('form#aspnetForm',
        {'ctl01$Main1$PasswordTextbox':'2oL2E93Xx7xc'}
        ,false);
    this.mouseEvent('click', '#ctl01_Main1_SignInBtn', "20%", "50%");
});

casper.then(function() {
    this.echo('Fourth Page: ' + this.getTitle());
    this.wait(1000);
    //this.reload();
    //this.wait(1000);
    this.clickLabel('EASY CHECKING', 'a');
    //this.echo(this.getPageContent());
});

casper.then(function() {
    var link = this.getElementAttribute('#ctl01_Main1_AccountHistoryUC_TPDownloadsBtn', 'onclick')
    var String = link.substring(link.indexOf("'")+1,link.lastIndexOf("'"));
    this.echo(String);
    var today = new Date();
    this.download("https://sccupcu.com"+String,
        today.getFullYear() +"_" + (today.getMonth() + 1) +"_"+ today.getDate() +"_"+today.getHours()+"_"+today.getMinutes()+"_"+today.getSeconds()+".qfx");
    this.echo('Fifth: ' + this.getCurrentUrl());
});
/*casper.thenOpen('http://phantomjs.org', function() {
    this.echo('Second Page: ' + this.getTitle());
});*/

casper.run();
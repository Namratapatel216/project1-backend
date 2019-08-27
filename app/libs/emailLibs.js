let verify_email_mail_content = (link) => {

    return `<!DOCTYPE html>
    <html>
    <title></title>
    <body style="background-color : lightgrey">
    
            <div style="background-color : white;margin-left:30%;margin-right:30%;height:500px;margin-top:5%;padding:2%;">
            
                <div style="text-align:center;padding-top:3%;" >
                    <h1>Meeting Planner</h1>
                    <hr style="background-color:red;">
                </div>
                
                
                
                <div style="padding : 5%;">Verify Your Email Address To Login Into The Meeting Planner Site.</div>
                
                <div style="text-align:center;">
                <a href="${link}" style="cursor:pointer">
                    <button style="    text-decoration: none;background-color: #1976d2;border-top: 10px solid #1976d2;border-bottom: 10px solid #1976d2;
        border-left: 20px solid #1976d2;
        border-right: 20px solid #1976d2;
        display: inline-block;
        border-radius: 3px;
        color: #ffffff;cursor:pointer;
        text-align: center;margin-top:6%;">Verify Email Now</button>
                </a>
                </div>
                
            <div>
    
    </body>
    </html>`;

}

let passwordRecovery_Link_content = (link) => {

    return `<!DOCTYPE html>
    <html>
    <title></title>
    <body style="background-color : lightgrey">
    
            <div style="background-color : white;margin-left:30%;margin-right:30%;height:500px;margin-top:5%;padding:2%;">
            
                <div style="text-align:center;padding-top:3%;" >
                    <h1>Meeting Planner</h1>
                    <hr style="background-color:red;">
                </div>
                
                
                
                <div style="padding : 5%;">Please Click Below Link To Recover Your Password. From There you can change your password.</div>
                
                <div style="text-align:center;">
                <a href="${link}" style="cursor:pointer">
                    <button style="    text-decoration: none;background-color: #1976d2;border-top: 10px solid #1976d2;border-bottom: 10px solid #1976d2;
        border-left: 20px solid #1976d2;
        border-right: 20px solid #1976d2;
        display: inline-block;
        border-radius: 3px;
        color: #ffffff;cursor:pointer;
        text-align: center;margin-top:6%;">Click Here To Recover Password</button>
                </a>
                </div>
                
            <div>
    
    </body>
    </html>`;

}

let Meeting_schedule_update_content_data = (meeting_purpose,Meeting_place,Meeting_start_date,Meeting_end_date) => {

    return `<!DOCTYPE html>
    <html>
    <title></title>
    <body style="background-color : lightgrey">
    
            <div style="background-color : white;margin-left:30%;margin-right:30%;height:500px;margin-top:5%;padding:2%;">
            
                <div style="text-align:center;padding-top:3%;" >
                    <h1>Meeting Planner</h1>
                    <hr style="background-color:red;">
                </div>
                
                
                
                <div style="padding : 5%;">Meeting Schedule is changed. So please check Updated Meeting Schedule and Follow Below Details For Meeting.</div>
                
                <div style="text-align:left;padding:3%;">
                    Meeting Purpose : ${meeting_purpose}
                </div>
                <br>
                <div style="text-align:left;padding:3%;">
                    Meeting Place : ${Meeting_place}
                </div>
                <br>
                <div style="text-align:left;padding:3%;">
                    Meeting Start Date and Time : ${new Date(Meeting_start_date)}
                </div>
                <br>
                <div style="text-align:left;padding:3%;">
                    Meeting End Date And Time : ${new Date(Meeting_end_date)}
                </div>
                
            <div>
    
    </body>
    </html>`;

}

let Meeting_creation_data = (meeting_purpose,Meeting_place,Meeting_start_date,Meeting_end_date) => {

    return `<!DOCTYPE html>
    <html>
    <title></title>
    <body style="background-color : lightgrey">
    
            <div style="background-color : white;margin-left:30%;margin-right:30%;height:500px;margin-top:5%;padding:2%;">
            
                <div style="text-align:center;padding-top:3%;" >
                    <h1>Meeting Planner</h1>
                    <hr style="background-color:red;">
                </div>
                
                
                
                <div style="padding : 5%;">Meeting Is Scheduled For You On Following Date And Place. So please check Below Meeting Date.</div>
                
                <div style="text-align:left;padding:3%;">
                    Meeting Purpose : ${meeting_purpose}
                </div>
                <br>
                <div style="text-align:left;padding:3%;">
                    Meeting Place : ${Meeting_place}
                </div>
                <br>
                <div style="text-align:left;padding:3%;">
                    Meeting Start Date and Time : ${new Date(Meeting_start_date)}
                </div>
                <br>
                <div style="text-align:left;padding:3%;">
                    Meeting End Date And Time : ${new Date(Meeting_end_date)}
                </div>
                
            <div>
    
    </body>
    </html>`;

}

module.exports = {

    verify_email_mail_content : verify_email_mail_content,
    passwordRecovery_Link_content : passwordRecovery_Link_content,
    Meeting_schedule_update_content_data : Meeting_schedule_update_content_data,
    Meeting_creation_data : Meeting_creation_data
}
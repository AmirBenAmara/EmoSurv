"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HtmlContent {
    EvalInvitation(testname, testLink, profilename) {
        return `<!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
            <meta charset="utf-8">
            <!-- utf-8 works for most cases -->
            <meta name="viewport" content="width=device-width">
            <!-- Forcing initial-scale shouldn't be necessary -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <!-- Use the latest (edge) version of IE rendering engine -->
            <meta name="x-apple-disable-message-reformatting">
            <!-- Disable auto-scale in iOS 10 Mail entirely -->
            <title></title>
            <!-- The title tag shows in email notifications, like Android 4.4. -->
        
            <!-- Web Font / @font-face : BEGIN -->
            <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->
        
            <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
            <!--[if mso]>
                        <style>
                            * {
                                font-family: sans-serif !important;
                            }
                        </style>
                    <![endif]-->
        
            <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
            <!--[if !mso]><!-->
            <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
            <!--<![endif]-->
        
            <!-- Web Font / @font-face : END -->
        
            <!-- CSS Reset : BEGIN -->
            <style>
                /* What it does: Remove spaces around the email design added by some email clients. */
        
                /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
        
                html,
                body {
                    margin: 0 auto !important;
                    padding: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                }
        
                /* What it does: Stops email clients resizing small text. */
        
                * {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }
        
                /* What it does: Centers email on Android 4.4 */
        
                div[style*="margin: 16px 0"] {
                    margin: 0 !important;
                }
        
                /* What it does: Stops Outlook from adding extra spacing to tables. */
        
                table,
                td {
                    mso-table-lspace: 0pt !important;
                    mso-table-rspace: 0pt !important;
                }
        
                /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
        
                table {
                    border-spacing: 0 !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                    margin: 0 auto !important;
                }
        
                table table table {
                    table-layout: auto;
                }
        
                /* What it does: Uses a better rendering method when resizing images in IE. */
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                /* What it does: A work-around for email clients meddling in triggered links. */
        
                *[x-apple-data-detectors],
                /* iOS */
        
                .x-gmail-data-detectors,
                /* Gmail */
        
                .x-gmail-data-detectors *,
                .aBn {
                    border-bottom: 0 !important;
                    cursor: default !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
        
                /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        
                .a6S {
                    display: none !important;
                    opacity: 0.01 !important;
                }
        
                /* If the above doesn't work, add a .g-img class to any image in question. */
        
                img.g-img+div {
                    display: none !important;
                }
        
                /* What it does: Prevents underlining the button text in Windows 10 */
        
                .button-link {
                    text-decoration: none !important;
                }
        
        
                /* Create one of these media queries for each additional viewport size you'd like to fix */
        
                /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        
                @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                    .email-container {
                        min-width: 320px !important;
                    }
                }
        
                /* iPhone 6, 6S, 7, 8, and X */
        
                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                    .email-container {
                        min-width: 375px !important;
                    }
                }
        
                /* iPhone 6+, 7+, and 8+ */
        
                @media only screen and (min-device-width: 414px) {
                    .email-container {
                        min-width: 414px !important;
                    }
                }
            </style>
            <!-- CSS Reset : END -->
        
            <!-- Progressive Enhancements : BEGIN -->
            <style>
                /* What it does: Hover styles for buttons */
        
                .button-td,
                .button-a {
                    transition: all 100ms ease-in;
                }
        
                .button-td:hover,
                .button-a:hover {
                    background: #555555 !important;
                    border-color: #555555 !important;
                }
        
                /* Media Queries */
        
                @media screen and (max-width: 600px) {
        
                    /* What it does: Adjust typography on small screens to improve readability */
                    .email-container p {
                        font-size: 17px !important;
                    }
        
                }
            </style>
            <!-- Progressive Enhancements : END -->
        
            <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
            <!--[if gte mso 9]>
                    <xml>
                        <o:OfficeDocumentSettings>
                            <o:AllowPNG/>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                    </xml>
                    <![endif]-->
        
        </head>
        <!--
                    The email background color (#222222) is defined in three places:
                    1. body tag: for most email clients
                    2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr
                    3. mso conditional: For Windows 10 Mail
                -->
        
        <body width="100%" bgcolor="#222222" style="margin: 0; mso-line-height-rule: exactly;">
            <center style="width: 100%; background: #222222; text-align: left;">
                <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#222222">
                    <tr>
                    <td>
                    <![endif]-->
        
                <!-- Visually Hidden Preheader Text : BEGIN -->
                <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                FivePoints: Evaluation test (${testname})
                </div>
                <!-- Visually Hidden Preheader Text : END -->
        
                <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->
                <!-- Preview Text Spacing Hack : BEGIN -->
                <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                </div>
                <!-- Preview Text Spacing Hack : END -->
        
                <!--
                            Set the email width. Defined in two places:
                            1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.
                            2. MSO tags for Desktop Windows Outlook enforce a 600px width.
                        -->
                <div style="max-width: 600px; margin: auto;" class="email-container">
                    <!--[if mso]>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
                            <tr>
                            <td>
                            <![endif]-->
        
                    <!-- Email Header : BEGIN -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                        <tr>
                            <td style="padding: 20px 0; text-align: center">
        
                            </td>
                        </tr>
                    </table>
                    <!-- Email Header : END -->
        
                    <!-- Email Body : BEGIN -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
        
                        <!-- Hero Image, Flush : BEGIN -->
                        <tr>
                            <td bgcolor="#ffffff" align="center">
                                <img src="https://scontent.ftun3-1.fna.fbcdn.net/v/t1.0-9/37689292_1922072597856819_470178092892028928_n.png?_nc_cat=0&oh=8e1e17b951b577a9b557f6b56159ae64&oe=5C0E6CFD"
                                    width="100%" height="" alt="alt_text" border="0" align="center" style="width: 100%; max-width: 200px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555; margin: auto;"
                                    class="g-img">
                            </td>
                        </tr>
                        <!-- Hero Image, Flush : END -->
        
                        <!-- 1 Column Text + Button : BEGIN -->
                        <tr>
                            <td bgcolor="#ffffff">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tbody>
                                        <tr>
                                            <td style="padding:40px;font-family:sans-serif;font-size:15px;line-height:140%;color:#555555">
                                                <h2 style="margin:0 0 10px 0;">
                                                    <center> Evaluation Invitation From FivePoints
        
                                                        <br>
                                                    </center>
                                                </h2>
                                                <h4>
                                                    <center>
         
                                                        <h4>Hello ${profilename}, You have been invited by FivePoints to take this test: "${testname}". Please follow the link below to begin your evaluation.

                                                        </h4>
                                                    </center>
        
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                        <tbody>
                                                            <tr>
                                                                <td style="border-radius:3px;background:#222222;text-align:center" class="m_2375839874429203999button-td">
                                                                   <a href="${testLink}" style="background: #222222; border: 15px solid #222222; font-family: sans-serif; font-size: 13px; line-height: 110%; text-align: center; text-decoration: none; display: block; border-radius: 3px; font-weight: bold;"
                                                                class="button-a">
                                                                <span style="color:#ffffff;" class="button-link">&nbsp;&nbsp;&nbsp;&nbsp;Begin the test&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                            </a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                </h4>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <!-- Two Even Columns : END -->
        
                        <!-- Clear Spacer : BEGIN -->
                        <tr>
        
                    </table>
                    <!-- Email Body : END -->
        
                    <!-- Email Footer : BEGIN -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style=" color: #888888;max-width: 600px;">
                        <tr>
                            <td style="padding: 40px 10px; font-family: sans-serif; font-size: 12px; line-height: 140%; text-align: center; color: #888888;"
                                class="x-gmail-data-detectors">
                                <!--                         <webversion style="color: #cccccc; text-decoration: underline; font-weight: bold;">View as a Web Page</webversion>
                 -->
                                <br>
                                <br> Five Points The Talent Pool
                                <br>Avenue de la bourse, immeuble wafa, bloc A 2 eme étage. 1053 Tunis, Tunisia
                                <br>71 190 418
                                <br>
                                <br>
                                <!--                         <unsubscribe style="color: #888888; text-decoration: underline;">unsubscribe</unsubscribe>
                 -->
                            </td>
                        </tr>
                    </table>
                    <!-- Email Footer : END -->
        
                    <!--[if mso]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                </div>
        
                <!-- Full Bleed Background Section : BEGIN -->
                <!--   <table role="presentation" bgcolor="#709f2b" cellspacing="0" cellpadding="0" border="0" align="center" width="100%">
                            <tr>
                                <td valign="top" align="center">
                                    <div style="max-width: 600px; margin: auto;" class="email-container">
                                        <!--[if mso]>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
                                        <tr>
                                        <td>
                                        <![endif]-->
                <!--   <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 40px; text-align: left; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #ffffff;">
                                                    <p style="margin: 0;">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut&nbsp;erat.</p>
                                                </td>
                                            </tr>
                                        </table> -->
                <!--[if mso]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                <!--      </div>
                                </td>
                            </tr>
                        </table> -->
                <!-- Full Bleed Background Section : END -->
        
                <!--[if mso | IE]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
            </center>
        </body>
        
        </html>`;
    }
    evalResult(testname, results, profilename) {
        return `<!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
            <meta charset="utf-8">
            <!-- utf-8 works for most cases -->
            <meta name="viewport" content="width=device-width">
            <!-- Forcing initial-scale shouldn't be necessary -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <!-- Use the latest (edge) version of IE rendering engine -->
            <meta name="x-apple-disable-message-reformatting">
            <!-- Disable auto-scale in iOS 10 Mail entirely -->
            <title></title>
            <!-- The title tag shows in email notifications, like Android 4.4. -->
        
            <!-- Web Font / @font-face : BEGIN -->
            <!-- NOTE: If web fonts are not required, lines 10 - 27 can be safely removed. -->
        
            <!-- Desktop Outlook chokes on web font references and defaults to Times New Roman, so we force a safe fallback font. -->
            <!--[if mso]>
                        <style>
                            * {
                                font-family: sans-serif !important;
                            }
                        </style>
                    <![endif]-->
        
            <!-- All other clients get the webfont reference; some will render the font and others will silently fail to the fallbacks. More on that here: http://stylecampaign.com/blog/2015/02/webfont-support-in-email/ -->
            <!--[if !mso]><!-->
            <!-- insert web font reference, eg: <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'> -->
            <!--<![endif]-->
        
            <!-- Web Font / @font-face : END -->
        
            <!-- CSS Reset : BEGIN -->
            <style>
                /* What it does: Remove spaces around the email design added by some email clients. */
        
                /* Beware: It can remove the padding / margin and add a background color to the compose a reply window. */
        
                html,
                body {
                    margin: 0 auto !important;
                    padding: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                }
        
                /* What it does: Stops email clients resizing small text. */
        
                * {
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%;
                }
        
                /* What it does: Centers email on Android 4.4 */
        
                div[style*="margin: 16px 0"] {
                    margin: 0 !important;
                }
        
                /* What it does: Stops Outlook from adding extra spacing to tables. */
        
                table,
                td {
                    mso-table-lspace: 0pt !important;
                    mso-table-rspace: 0pt !important;
                }
        
                /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
        
                table {
                    border-spacing: 0 !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                    margin: 0 auto !important;
                }
        
                table table table {
                    table-layout: auto;
                }
        
                /* What it does: Uses a better rendering method when resizing images in IE. */
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                /* What it does: A work-around for email clients meddling in triggered links. */
        
                *[x-apple-data-detectors],
                /* iOS */
        
                .x-gmail-data-detectors,
                /* Gmail */
        
                .x-gmail-data-detectors *,
                .aBn {
                    border-bottom: 0 !important;
                    cursor: default !important;
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
        
                /* What it does: Prevents Gmail from displaying a download button on large, non-linked images. */
        
                .a6S {
                    display: none !important;
                    opacity: 0.01 !important;
                }
        
                /* If the above doesn't work, add a .g-img class to any image in question. */
        
                img.g-img+div {
                    display: none !important;
                }
        
                /* What it does: Prevents underlining the button text in Windows 10 */
        
                .button-link {
                    text-decoration: none !important;
                }
        
        
                /* Create one of these media queries for each additional viewport size you'd like to fix */
        
                /* iPhone 4, 4S, 5, 5S, 5C, and 5SE */
        
                @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
                    .email-container {
                        min-width: 320px !important;
                    }
                }
        
                /* iPhone 6, 6S, 7, 8, and X */
        
                @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
                    .email-container {
                        min-width: 375px !important;
                    }
                }
        
                /* iPhone 6+, 7+, and 8+ */
        
                @media only screen and (min-device-width: 414px) {
                    .email-container {
                        min-width: 414px !important;
                    }
                }
            </style>
            <!-- CSS Reset : END -->
        
            <!-- Progressive Enhancements : BEGIN -->
            <style>
                /* What it does: Hover styles for buttons */
        
                .button-td,
                .button-a {
                    transition: all 100ms ease-in;
                }
        
                .button-td:hover,
                .button-a:hover {
                    background: #555555 !important;
                    border-color: #555555 !important;
                }
        
                /* Media Queries */
        
                @media screen and (max-width: 600px) {
        
                    /* What it does: Adjust typography on small screens to improve readability */
                    .email-container p {
                        font-size: 17px !important;
                    }
        
                }
            </style>
            <!-- Progressive Enhancements : END -->
        
            <!-- What it does: Makes background images in 72ppi Outlook render at correct size. -->
            <!--[if gte mso 9]>
                    <xml>
                        <o:OfficeDocumentSettings>
                            <o:AllowPNG/>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                        </o:OfficeDocumentSettings>
                    </xml>
                    <![endif]-->
        
        </head>
        <!--
                    The email background color (#222222) is defined in three places:
                    1. body tag: for most email clients
                    2. center tag: for Gmail and Inbox mobile apps and web versions of Gmail, GSuite, Inbox, Yahoo, AOL, Libero, Comcast, freenet, Mail.ru, Orange.fr
                    3. mso conditional: For Windows 10 Mail
                -->
        
        <body width="100%" bgcolor="#222222" style="margin: 0; mso-line-height-rule: exactly;">
            <center style="width: 100%; background: #222222; text-align: left;">
                <!--[if mso | IE]>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#222222">
                    <tr>
                    <td>
                    <![endif]-->
        
                <!-- Visually Hidden Preheader Text : BEGIN -->
                <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                FivePoints: Evaluation results (${testname})                </div>
                <!-- Visually Hidden Preheader Text : END -->
        
                <!-- Create white space after the desired preview text so email clients don’t pull other distracting text into the inbox preview. Extend as necessary. -->
                <!-- Preview Text Spacing Hack : BEGIN -->
                <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
                    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
                </div>
                <!-- Preview Text Spacing Hack : END -->
        
                <!--
                            Set the email width. Defined in two places:
                            1. max-width for all clients except Desktop Windows Outlook, allowing the email to squish on narrow but never go wider than 600px.
                            2. MSO tags for Desktop Windows Outlook enforce a 600px width.
                        -->
                <div style="max-width: 600px; margin: auto;" class="email-container">
                    <!--[if mso]>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
                            <tr>
                            <td>
                            <![endif]-->
        
                    <!-- Email Header : BEGIN -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
                        <tr>
                            <td style="padding: 20px 0; text-align: center">
        
                            </td>
                        </tr>
                    </table>
                    <!-- Email Header : END -->
        
                    <!-- Email Body : BEGIN -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">
        
                        <!-- Hero Image, Flush : BEGIN -->
                        <tr>
                            <td bgcolor="#ffffff" align="center">
                                <img src="https://scontent.ftun3-1.fna.fbcdn.net/v/t1.0-9/37689292_1922072597856819_470178092892028928_n.png?_nc_cat=0&oh=8e1e17b951b577a9b557f6b56159ae64&oe=5C0E6CFD"
                                    width="100%" height="" alt="alt_text" border="0" align="center" style="width: 100%; max-width: 200px; height: auto; background: #dddddd; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #555555; margin: auto;"
                                    class="g-img">
                            </td>
                        </tr>
                        <!-- Hero Image, Flush : END -->
        
                        <!-- 1 Column Text + Button : BEGIN -->
                        <tr>
                            <td bgcolor="#ffffff">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tbody>
                                        <tr>
                                            <td style="padding:40px;font-family:sans-serif;font-size:15px;line-height:140%;color:#555555">
                                                <h2 style="margin:0 0 10px 0;">
                                                    <center> Evaluation Results 
        
                                                        <br>
                                                    </center>
                                                </h2>
                                                <h4>
                                                    <center>
                                                        <h4>Hello ${profilename}, Results for test ${testname} are : <br>
                                                        ${results}
                                                        </h4>
                                                    </center>
        
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                        <tbody>
                                                            <tr>
                                                            <center>
                                                                <h4>Thank you for completing your evaluation.</h4>
                                                            </center>
                                                                
                                                            </tr>
                                                        </tbody>
                                                    </table>
        
                                                </h4>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <!-- Two Even Columns : END -->
        
                        <!-- Clear Spacer : BEGIN -->
                        <tr>
        
                    </table>
                    <!-- Email Body : END -->
        
                    <!-- Email Footer : BEGIN -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style=" color: #888888;max-width: 600px;">
                        <tr>
                            <td style="padding: 40px 10px; font-family: sans-serif; font-size: 12px; line-height: 140%; text-align: center; color: #888888;"
                                class="x-gmail-data-detectors">
                                <!--                         <webversion style="color: #cccccc; text-decoration: underline; font-weight: bold;">View as a Web Page</webversion>
                 -->
                                <br>
                                <br> Five Points The Talent Pool
                                <br>Avenue de la bourse, immeuble wafa, bloc A 2 eme étage. 1053 Tunis, Tunisia
                                <br>71 190 418
                                <br>
                                <br>
                                <!--                         <unsubscribe style="color: #888888; text-decoration: underline;">unsubscribe</unsubscribe>
                 -->
                            </td>
                        </tr>
                    </table>
                    <!-- Email Footer : END -->
        
                    <!--[if mso]>
                            </td>
                            </tr>
                            </table>
                            <![endif]-->
                </div>
        
                <!-- Full Bleed Background Section : BEGIN -->
                <!--   <table role="presentation" bgcolor="#709f2b" cellspacing="0" cellpadding="0" border="0" align="center" width="100%">
                            <tr>
                                <td valign="top" align="center">
                                    <div style="max-width: 600px; margin: auto;" class="email-container">
                                        <!--[if mso]>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" align="center">
                                        <tr>
                                        <td>
                                        <![endif]-->
                <!--   <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 40px; text-align: left; font-family: sans-serif; font-size: 15px; line-height: 140%; color: #ffffff;">
                                                    <p style="margin: 0;">Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus. Maecenas scelerisque congue eros eu posuere. Praesent in felis ut velit pretium lobortis rhoncus ut&nbsp;erat.</p>
                                                </td>
                                            </tr>
                                        </table> -->
                <!--[if mso]>
                                        </td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                <!--      </div>
                                </td>
                            </tr>
                        </table> -->
                <!-- Full Bleed Background Section : END -->
        
                <!--[if mso | IE]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
            </center>
        </body>
        
        </html>`;
    }
}
exports.HtmlContent = HtmlContent;
//# sourceMappingURL=htmlContent.js.map
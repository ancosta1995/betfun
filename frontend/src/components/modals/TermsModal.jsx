import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";

import { themeConfig } from '../../config/config';  // Adjust the path if necessary

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    zIndex : 99999,

    minHeight: "35rem",
    width: "100%",
    "& .MuiDialog-paperWidthSm": {
      scrollbarWidth: "none",
      background: "#050614",
      borderRadius: "0.5em",
      color: "#fff",
      maxWidth: "800px",
      scrollbarWidth: "none",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
    },
  },
  titleBox: {
    display: "flex",
    boxShadow: "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
    alignItems: "center",
    paddingTop: "1em",
    paddingLeft: "1.5em",
    paddingRight: "1em",
    paddingBottom: "1em",
    fontFamily: "Poppins", 
    backgroundColor: "#101123", 
    justifyContent: "space-between",
    width: "100%"
  },
  content: {
    zIndex : 99999,
    overflowY: 'scroll',
    padding: "1.5em",
    display: "block",
    scrollbarColor: `${themeConfig.scrollbarColor} ${themeConfig.defaultbackground}`,
    scrollbarWidth: 'thin',
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      margin: "0 0 2rem 0",
      color: "#b9b9b9",
      fontFamily: "Poppins",
      fontSize: "19px",
      fontWeight: 500,
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Poppins",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
  buttonIcon: {
    color: "#9E9FBD",
    marginRight: ".5em",
    fill: "currentColor",
    flex: "none",
    width: "1.25em",
    height: "1.25em",
    display: "inline-block",
    outline: "none",
  },
  ol: {
    zIndex : 99999,

    marginBlockEnd: 0,
    marginBlockStart: "1em",
    paddingInlineStart: "2em",
    color: "hsl(220, 22%, 90%)"
  }
}));

const TermsModal = ({ open, handleClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Poppins",     zIndex : 99999,
      }}
      open={open}
      
    >
      <div className={classes.titleBox} onClose={handleClose} >
        <span style={{flex: "auto", fontSize: "1.5rem", color: "#E0E4EB" }}>Terms of Service</span>
        <svg className={classes.buttonIcon} style={{cursor: "pointer"}} onClick={() => handleClose()} fill="currentColor" tabIndex="-1" viewBox="0 0 320 512"><path d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>
      </div>
      <div className={classes.content} >
        <div style={{color: "hsl(220, 22%, 90%)"}}>
          Date Last Modified: May 07, 2024
          <br />
          Thank you for reviewing these Terms and Conditions of Use (the “Terms of Use,” “Terms,” or “Agreement”). (betfun.gg,” “We,” “Us,” or “Our”) makes betfun.gg, (“Website”), its mobile application (“App”), and any other services (collectively “Services) available for your (“You,” “Your,” “User,” or “Users”) use subject to this Agreement. This Agreement spells out what Users can expect from betfun.gg and what betfun.gg expects from its Users.
        </div>
        <h3>Acceptance of Terms</h3>
        <ol className={classes.ol}>
          <li>By downloading the App, using the Website, or participating in betfun.gg, including, without limitation, participating in its games and contests (each a “Contest”), Users acknowledge that they have read and agree to be bound to and abide by these Terms.</li>
          <li>betfun.gg reserves the right to change these Terms at any time without prior notice to Users. If We modify these Terms, we will update the “Date Last Modified” and such changes will be effective upon posting. If We make what we determine to be material changes to these Terms, we will notify Users by prominently posting a notice on the Website and/or App or by sending a notice to the e-mail addresses on file. Users continued use of betfun.gg following such changes constitutes acceptance of such changes. If Users do not agree to the changes, their sole remedy is to cease using betfun.gg.</li>
        </ol>

        <h3>Age Restrictions</h3>
        <ol className={classes.ol}>
          <li>No individual under the age of eighteen (18), or under the age of majority in your jurisdiction, may use betfun.gg, regardless of any consent from a parent or guardian to use betfun.gg.</li>
          <li>We offer our Services in the United States, with the exception of the states of Nevada and Washington state. You may not access our Website from Nevada and Washington. You are not eligible to participate in our Services or to win any prizes.</li>
          <li>betfun.gg makes no representations or warranties, implicit or explicit, as to your legal right to participate in the betfun.gg or that the contests provided through betfun.gg are appropriate or available for use in the jurisdiction in which you are located.</li>
        </ol>

        <h3>Accounts</h3>
        <ol className={classes.ol}>
          <li>Only one (1) Account is allowed per person. In the event that betfun.gg determines that You have registered more than one (1) Account, then You acknowledge and agree that, in addition to any other rights that betfun.gg may have, betfun.gg has the right to suspend or terminate Your Account(s), refuse any and all current or future use of betfun.gg, and withhold or revoke the awarding of any prizes.</li>
          <li>You are responsible for maintaining the confidentiality of your login names and passwords. It shall be a violation of these Terms of Use to allow any other person to use your account to participate in any contest.</li>
        </ol>

        <h3>No Transfer</h3>
        <ol className={classes.ol}>
          <li>Your Account is not transferable. Under no circumstances shall You allow or permit any other person or third-party, including, without limitation, any person under the age of eighteen (18), to use or re-use Your Account in such a way that may breach the standards or laws in any jurisdiction where You are located and/or are a resident, or where such other person is located and/or is a resident.</li>
          <li>Any person found to have violated this section may be reported to the relevant authorities and will forfeit their Account. betfun.gg will not be liable for any loss that You may incur as a result of someone else using Your Account, either with or without Your knowledge, unless You have previously notified betfun.gg as provided herein that Your Identifiers are no longer secure and confidential.</li>
        </ol>

        <h3>Wallet</h3>
        <ol className={classes.ol}>
          <li>By adding funds to your wallet on the Website (“Wallet”), you accept that the credits received (indicated by a “$” sign) or any other funds in the account have no real money value and that the virtual products have no real money value.</li>
          <li>The Website is not a banking institution. Replenishment of funds for your Wallet is carried out through a third-party payment system for receiving payments and is not managed by us.</li>
        </ol>

        <h3>Browsers/Equipment</h3>
        <ol className={classes.ol}>
          <li>You acknowledge and agree that betfun.gg may cease to support a given Web browser and that your continuous use of betfun.gg will require you to download a supported Web browser.</li>
          <li>You also acknowledge and agree that the performance of betfun.gg is incumbent on the performance of your computer equipment and your Internet connection.</li>
        </ol>

        <h3>Contests and Features</h3>
        <ol className={classes.ol}>
          <li>We offer several contests and other features on the Website. You can participate for the chance to win prizes. Our contests are free to play. Our features may change from time to time, at our sole discretion. We reserve the right to modify or cancel contests at any time without notice to You. Contest rules and scoring may differ from contest to contest. Each of our contests are governed by specific rules, as may be modified from time to time, which are set forth in the official rules for each contest and are incorporated into these Terms by this reference.</li>
          <li>You have the responsibility to review the rules prior to participating in any contest, and to review the rules for any changes. You agree to abide by the then-current rules for the contest(s) in which You participate. Your failure to follow the then-current rules for the contest(s) in which You participate will result in Your immediate and automatic forfeiture of the contest(s), and We reserve the right to immediately suspend or terminate Your access to betfun.gg.</li>
          <li>Winners are determined by the applicable documentation associated with the contest. betfun.gg may not be used for any form of illicit gambling.</li>
          <li>You may make monetary deposits on the site and receive credits to purchase lootboxes. You may also receive free credits by participating in our rain bonus or claiming our free daily case.</li>
          <li>We also offer “Case Battles,” which involve between two and four players. All players purchase a loot box and open the boxes simultaneously. The player with the better item keeps that item and the other players’ prizes.</li>
          <li>Rain – We offer a rewards program called “rain.” A base of 200 credits plus a percentage of all spend on the site during the stated time period (30 minutes) is added to each rain. Each rain lasts for 30 minutes. At the end of this 30-minute period, any eligible user who is over level 1 or has completed the KYC on site can join and receive a equal share of the total pot. Rain is a reward for players to collect while they are actively playing on the site as part of our free to play system. Abusing Rain contrary to its intended purpose, may result in the termination of your account at the sole discretion of the betfun.gg.</li>
        </ol>

        <h3>Results and Winners</h3>
        <ol className={classes.ol}>
          <li>The results and winners of each contest will be determined by Us at Our sole discretion and such determinations are final. We reserve the right to make adjustments based on errors or irregularities in Our calculation of results. We also may make adjustments in the event of noncompliance with the Terms. Any decision by betfun.gg as to the winner(s) of a contest shall stand as a final and binding decision. betfun.gg has no obligation to delay the awarding of a prize in anticipation of any adjustment, but We reserve the right to reverse prizes in the event of any adjustment. By registering an Account and/or participating in any contest, you unconditionally agree that betfun.gg shall serve as the sole judge and arbiter as to the determination of a winner(s) in all contests in the event a dispute arises and agree to cooperate with Our efforts to reverse prizing, as necessary.</li>
          <li>We reserve the right, in our sole and absolute discretion, to deny any contestant the ability to participate in any contests for any reason whatsoever. Further, betfun.gg may, in its sole and absolute discretion, invalidate any contest result for the purposes of preventing abusive and/or any unfair or potentially unlawful activity, or in the event that there is a risk of any such abusive, illegal, or unfair activity.</li>
          <li>betfun.gg also reserves the right to cancel contests, in our sole discretion, without any restrictions. betfun.gg, in its sole discretion, may disqualify you from a contest or the entire Service, refuse to award prizes and require the return of any prizes, or suspend, limit, or terminate your account if you engage in conduct betfun.gg deems, in its sole discretion, to be improper, unfair, fraudulent or otherwise adverse to the operation of the Service or in any way detrimental to other users. Improper conduct includes, but is not limited to: falsifying personal information, including payment information, required to use the Service or claim a prize; violating eligible payment method terms, violating any of these rules, accumulating points or prizes through unauthorized methods such as unauthorized scripts or other automated means; tampering with the administration of the Service or trying to in any way tamper with the computer programs associated with the Service; obtaining other entrants’ information and spamming or being abusive or harassing to other entrants; and abusing the Service in any way; or otherwise violating these Terms of Use. You acknowledge that the forfeiture and/or return of any prize shall in no way prevent betfun.gg from informing the relevant authorities, and/or pursuing criminal or civil proceedings in connection with such conduct.</li>
          <li>If for any reason the Service is not running as originally planned (e.g., if the Site becomes corrupted or does not allow the proper usage and processing of entries in accordance with the rules, or if infection by a computer virus, bugs, tampering, unauthorized intervention, actions by entrants, fraud, technical failures, or any other causes of any kind, in the sole opinion of betfun.gg corrupts or affects the administration, security, fairness, integrity or proper conduct of the Service), betfun.gg reserves the right, in its sole discretion, to disqualify any individual implicated in or relating to the cause and/or to cancel, terminate, extend, modify or suspend the Service, and select the winner(s) from all eligible entries received. If such cancellation, termination, modification or suspension occurs, notification may be posted on the Website.</li>
          <li>The failure of betfun.gg to comply with any provision of these Terms due to an act of God, for example hurricane, war, fire, riot, earthquake, terrorism, act of public enemies, actions of governmental authorities outside of the control of betfun.gg (excepting compliance with applicable codes and regulations) or other force majeure event will not be considered a breach of these Terms.</li>
        </ol>

      </div> 
    </Dialog>
  );
};

export default TermsModal;

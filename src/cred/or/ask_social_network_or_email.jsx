import React from 'react';
import Screen from '../../lock/screen';
import EmailPane from '../email/email_pane';
import SocialButtonsPane from '../social/social_buttons_pane';
import PaneSeparator from '../../lock/pane_separator';

import { requestPasswordlessEmail } from '../../passwordless/actions';
import { renderEmailSentConfirmation } from '../../passwordless/email_sent_confirmation';
import { renderSignedInConfirmation } from '../../lock/signed_in_confirmation';

export default class AskSocialNetworkOrEmail extends Screen {

  constructor(lock) {
    super("networkOrEmail", lock);
  }

  submitHandler() {
    return requestPasswordlessEmail;
  }

  renderAuxiliaryPane() {
    return renderEmailSentConfirmation(this.lock)
      || renderSignedInConfirmation(this.lock);
  }

  render({lock}) {
    return (
      <div>
        <SocialButtonsPane lock={lock} />
        <PaneSeparator>{this.t(["separatorText"])}</PaneSeparator>
        <EmailPane
          lock={lock}
          placeholder={this.t(["emailInputPlaceholder"], {__textOnly: true})}
        />
      </div>
    );
  }

}

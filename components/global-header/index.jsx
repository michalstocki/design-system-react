/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// # Global Header Component

// Implements the [Global Header design pattern](https://www.lightningdesignsystem.com/components/global-header) in React.

// ## Dependencies

// ### React
import React from 'react';

// ## Constants
import { GLOBAL_HEADER, GLOBAL_HEADER_PROFILE, GLOBAL_HEADER_SEARCH, GLOBAL_HEADER_TOOL } from '../../utilities/constants';

// Removes the need for `PropTypes`.
const { PropTypes } = React;

/**
 * Component description.
 */
const GlobalHeader = React.createClass({
	displayName: GLOBAL_HEADER,

	propTypes: {
		children: PropTypes.node,
		onSkipToContent: PropTypes.func.isRequired,
		onSkipToNav: PropTypes.func.isRequired,
		skipToContentAssistiveText: PropTypes.string,
		skipToNavAssistiveText: PropTypes.string
	},

	getDefaultProps () {
		return {
			skipToNavAssistiveText: 'Skip to Navigation',
			skipToContentAssistiveText: 'Skip to Main Content'
		};
	},

	render () {
		let tools;
		let search;
		let profile;

		React.Children.forEach(this.props.children, (child) => {
			if (child && child.type.displayName === GLOBAL_HEADER_TOOL) {
				if (!tools) tools = [];
				tools.push(child);
			} else if (child && child.type.displayName === GLOBAL_HEADER_SEARCH) {
				search = child;
			} else if (child && child.type.displayName === GLOBAL_HEADER_PROFILE) {
				profile = child;
			}
		});

		/* eslint-disable max-len */
		return (
			<header className="slds-global-header_container"><a href="#" className="slds-assistive-text slds-assistive-text--focus">{this.props.skipToNavAssistiveText}</a><a href="#" className="slds-assistive-text slds-assistive-text--focus">{this.props.skipToContentAssistiveText}</a>
				<div className="slds-global-header slds-grid slds-grid--align-spread">
					<div className="slds-global-header__item">
						<div className="slds-global-header__logo">
							<img src="/assets/images/logo.svg" alt="" />
						</div>
					</div>
					{search &&
						<div className="slds-global-header__item slds-global-header__item--search">
							{search}
						</div>
					}
					<ul className="slds-global-header__item slds-grid slds-grid--vertical-align-center">
						{tools}
						{profile}
					</ul>
				</div>
			</header>
		);
		/* eslint-enable max-len */
	}
});

export default GlobalHeader;

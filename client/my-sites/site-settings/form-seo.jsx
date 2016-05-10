/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Button from 'components/button';
import SectionHeader from 'components/section-header';
import ExternalLink from 'components/external-link';
import Notice from 'components/notice';
import NoticeAction from 'components/notice/notice-action';
import protectForm from 'lib/mixins/protect-form';
import FormInput from 'components/forms/form-text-input-with-affixes';
import FormInputValidation from 'components/forms/form-input-validation';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormSettingExplanation from 'components/forms/form-setting-explanation';
import get from 'lodash/get';
import notices from 'notices';

export default React.createClass( {
	displayName: 'SiteSettingsFormSEO',

	mixins: [ protectForm.mixin ],

	getInitialState() {
		const { site } = this.props;
		return {
			blog_public: 1,
			seo_meta_description: get( site, 'options.seo_meta_description', '' ),
			verification_services_codes: get( site, 'options.verification_services_codes', null )
		};
	},

	handleMetaChange( event ) {
		this.setState( { seo_meta_description: get( event, 'target.value', '' ) } );
	},

	handleVerificationCodeChange( event ) {
		const productId = get( event, 'target.id', '' ).replace( 'verification_code_', '' );

		// Build verification services object to send back to API
		let verificationServicesCodes = this.getCurrentVerificationCodes();

		if ( ! verificationServicesCodes.hasOwnProperty( productId ) ) {
			return;
		}

		verificationServicesCodes[ productId ] = get( event, 'target.value', '' );

		this.setState( { verification_services_codes: verificationServicesCodes } );
	},

	getCurrentVerificationCodes() {
		return {
			google: this.refs.verification_code_google.props.value,
			bing: this.refs.verification_code_bing.props.value,
			pinterest: this.refs.verification_code_pinterest.props.value,
			yandex: this.refs.verification_code_yandex.props.value
		};
	},

	submitSeoForm( event ) {
		var site = this.props.site;

		if ( ! event.isDefaultPrevented() && event.nativeEvent ) {
			event.preventDefault();
		}

		notices.clearNotices( 'notices' );

		this.setState( { submittingForm: true } );

		const updatedOptions = {
			seo_meta_description: this.state.seo_meta_description,
			verification_services_codes: this.state.verification_services_codes
		};

		site.saveSettings( updatedOptions, error => {
			if ( error ) {
				switch ( error.error ) {
					case 'invalid_ip':
						notices.error( this.translate( 'One of your IP Addresses was invalid. Please, try again.' ) );
						break;
					default:
						notices.error( this.translate( 'There was a problem saving your changes. Please, try again.' ) );
				}
				this.setState( { submittingForm: false } );
			} else {
				notices.success( this.translate( 'Settings saved!' ) );
				this.markSaved();
				this.setState( { submittingForm: false } );

				site.fetchSettings();
			}
		} );
	},

	render() {
		const { site } = this.props;
		const { submittingForm, seo_meta_description, verification_services_codes } = this.state;

		const blog_public = get( site, 'settings.blog_public', 1 );
		const isSitePrivate = parseInt( blog_public, 10 ) !== 1;

		const fetchingSettings = get( site, 'fetchingSettings', false );
		const isDisabled = isSitePrivate || fetchingSettings || submittingForm;
		const isMetaError = seo_meta_description && seo_meta_description.length > 160;
		const sitemapUrl = `https://${ site.slug }/sitemap.xml`;
		const generalSettingsUrl = `/settings/general/${ site.slug }`;

		// The API returns 'false' for an empty array value, so we force it to an empty string if needed
		const googleCode = get( verification_services_codes, 'google' ) || '';
		const bingCode = get( verification_services_codes, 'bing' ) || '';
		const pinterestCode = get( verification_services_codes, 'pinterest' ) || '';
		const yandexCode = get( verification_services_codes, 'yandex' ) || '';

		return (
			<div className={ this.state.fetchingSettings ? 'is-loading' : '' }>
				{ isSitePrivate &&
					<Notice status="is-warning" showDismiss={ false } text={ this.translate( 'SEO settings are disabled because the site visibility is not set to Public.' ) }>
						<NoticeAction href={ generalSettingsUrl }>{ this.translate( 'View Settings' ) }</NoticeAction>
					</Notice>
				}
				<SectionHeader label={ this.translate( 'Search Engine Optimization' ) }>
					<Button
						compact={ true }
						onClick={ this.submitSeoForm }
						primary={ true }

						type="submit"
						disabled={ isDisabled || this.state.submittingForm }>
							{ this.state.submittingForm
								? this.translate( 'Saving…' )
								: this.translate( 'Save Settings' )
							}
					</Button>
				</SectionHeader>
				<Card>
					<p>
						{ this.translate(
							'{{b}}WordPress.com has great SEO{{/b}} out of the box. All of our themes are optimized for search engines, ' +
							'so you don\'t have to do anything extra. However, you can tweak these settings if you\'d like more advanced control. ' +
							'Read more about what you can do to {{a}}optimize your site\'s SEO.{{/a}}',
							{
								components: {
									a: <a href={ 'https://en.blog.wordpress.com/2013/03/22/seo-on-wordpress-com/' } />,
									b: <strong />
								}
							}
						) }
					</p>
					<form onChange={ this.markChanged } className="seo-form">
						<FormFieldset>
							<FormFieldset className="has-divider is-top-only">
								<FormLabel htmlFor="seo_meta_description">{ this.translate( 'Front Page Meta Description' ) }</FormLabel>
								<FormInput
									name="seo_meta_description"
									type="text"
									id="seo_meta_description"
									value={ seo_meta_description }
									disabled={ isDisabled }
									isError={ isMetaError }
									onChange={ this.handleMetaChange } />
								{ isMetaError &&
									<FormInputValidation isError={ true } text={ this.translate( 'Description can\'t be longer than 160 characters.' ) } />
								}
								<FormSettingExplanation>
									{ this.translate( 'Craft a description of your site in 160 characters or less. This description can be used in search engine results for your site\'s Front Page.' ) }
								</FormSettingExplanation>
							</FormFieldset>

							<FormFieldset className="has-divider">
								<FormLabel htmlFor="seo_sitemap">{ this.translate( 'XML Sitemap' ) }</FormLabel>
								<ExternalLink icon={ true } href={ sitemapUrl } target={ "_blank" }>{ sitemapUrl }</ExternalLink>
								<FormSettingExplanation>
									{ this.translate( 'Your site\'s sitemap is automatically sent to all major search engines for indexing.' ) }
								</FormSettingExplanation>
							</FormFieldset>

							<FormFieldset>
								<FormLabel htmlFor="verification_code_google">{ this.translate( 'Site Verification Services' ) }</FormLabel>
									<p>
										{ this.translate( 'Note that {{b}}verifying your site with these services is not necessary{{/b}} in order' +
										' for your site to be indexed by search engines. To verify your site with a service, paste the HTML Tag' +
										' code below. {{support}}Full instructions{{/support}}. Supported verification services:' +
										' {{google}}Google Search Console{{/google}}, {{bing}}Bing Webmaster Center{{/bing}},' +
										' {{pinterest}}Pinterest Site Verification{{/pinterest}}, and {{yandex}}Yandex.Webmaster{{/yandex}}.',
											{
												components: {
													b: <strong />,
													support: <a target="_blank" href="https://en.support.wordpress.com/webmaster-tools/" />,
													google: <a target="_blank" href="https://www.google.com/webmasters/tools/" />,
													bing: <a target="_blank" href="https://www.bing.com/webmaster/" />,
													pinterest: <a target="_blank" href="https://pinterest.com/website/verify/" />,
													yandex: <a target="_blank" href="https://webmaster.yandex.com/sites/" />
												}
											}
										) }
									</p>
								<FormInput
									ref="verification_code_google"
									prefix={ this.translate( 'Google' ) }
									name="verification_code_google"
									type="text"
									value={ googleCode }
									id="verification_code_google"
									disabled={ isDisabled }
									onChange={ this.handleVerificationCodeChange } />
							</FormFieldset>

							<FormFieldset>
								<FormInput
									ref="verification_code_bing"
									prefix={ this.translate( 'Bing' ) }
									name="verification_code_bing"
									type="text"
									value={ bingCode }
									id="verification_code_bing"
									disabled={ isDisabled }
									onChange={ this.handleVerificationCodeChange } />
							</FormFieldset>

							<FormFieldset>
								<FormInput
									ref="verification_code_pinterest"
									prefix={ this.translate( 'Pinterest' ) }
									name="verification_code_pinterest"
									type="text"
									value={ pinterestCode }
									id="verification_code_pinterest"
									disabled={ isDisabled }
									onChange={ this.handleVerificationCodeChange } />
							</FormFieldset>

							<FormFieldset>
								<FormInput
									ref="verification_code_yandex"
									prefix={ this.translate( 'Yandex' ) }
									name="verification_code_yandex"
									type="text"
									value={ yandexCode }
									id="verification_code_yandex"
									disabled={ isDisabled }
									onChange={ this.handleVerificationCodeChange } />
							</FormFieldset>

						</FormFieldset>
					</form>
				</Card>
			</div>
		);
	}
} );

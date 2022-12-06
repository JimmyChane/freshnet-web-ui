<script>
	import Contact from "./Footer_Contact.vue";
	import Company from "@/host/Company";

	export default {
		components: { Contact },
		data() {
			return {
				address1: Company.Location.toLine1().toStringWithSeparator(),
				address2: Company.Location.toLine2().toStringWithSeparator(),
				address3: Company.Location.toLine3(),
				addressHref: Company.Location.toHref(),
			};
		},
		computed: {
			contacts() {
				return Company.Contacts.toArray().map((contact) => {
					return {
						title: contact.title,
						subtitle: contact.links[0].id,
						links: contact.links.map((link) => {
							return {
								icon: link.category.icon,
								href: link.toHtmlHref(),
								target: link.toHtmlTarget(),
							};
						}),
					};
				});
			},
		},
	};
</script>

<template>
	<div class="PageHomeFooter">
		<div class="PageHomeFooter-main">
			<div class="PageHomeFooter-rows">
				<div class="PageHomeFooter-columns">
					<div class="PageHomeFooter-section">
						<span class="PageHomeFooter-section-title">Service</span>
						<router-link
							class="PageHomeFooter-section-item"
							:to="{ path: '/print' }"
							>Photostat &amp; Printing</router-link
						>
						<!-- <span class="PageHomeFooter-section-item">Networking</span> -->
						<!-- <span class="PageHomeFooter-section-item">Chop Stamp</span> -->
						<!-- <span class="PageHomeFooter-section-item">CCTV</span> -->
						<!-- <span class="PageHomeFooter-section-item">Name Card</span> -->
					</div>
				</div>

				<div class="PageHomeFooter-columns">
					<div class="PageHomeFooter-section">
						<span class="PageHomeFooter-section-title">Contacts</span>
						<Contact
							v-for="contact of contacts"
							:key="contact.subtitle"
							:title="contact.title"
							:subtitle="contact.subtitle"
							:links="contact.links"
						/>
					</div>
				</div>

				<div class="PageHomeFooter-columns">
					<div class="PageHomeFooter-section">
						<span class="PageHomeFooter-section-title">Location</span>
						<a
							class="PageHomeFooter-section-item"
							:href="addressHref"
							target="__blank"
							>{{ address1 }}<br />{{ address2 }}<br />{{ address3 }}</a
						>
					</div>
				</div>
			</div>
		</div>

		<span class="PageHomeFooter-credit">Created by Jimmy & Rory</span>
	</div>
</template>

<style lang="scss" scoped>
	.PageHomeFooter {
		// --primary-color: #b6c4ce;
		// --primary-color: black;
		--primary-color: hsl(0, 0%, 20%);

		width: 100%;
		margin-top: 4rem;
		padding: 2rem;
		padding-bottom: 10rem;
		gap: 4rem;
		position: relative;

		text-decoration: none;
		background: black;
		background-color: var(--primary-color);
		// color: #1b303d;
		color: white;

		display: flex;
		flex-direction: column;
		align-items: center;

		.PageHomeFooter-main {
			max-width: var(--default-max-width);
			width: 100%;
			gap: 4rem;

			display: flex;
			flex-direction: column;
			align-items: flex-start;

			.PageHomeFooter-rows {
				width: 100%;
				row-gap: 2.5rem;
				row-gap: 3rem;
				row-gap: 2.5rem;
				column-gap: 5rem;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.PageHomeFooter-columns {
					row-gap: 2.5rem;
					column-gap: 5rem;
					width: max-content;
					display: flex;
					flex-direction: column;
					.PageHomeFooter-section {
						width: 100%;
						gap: 0.1rem;

						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: flex-start;
						.PageHomeFooter-section-title {
							width: 100%;
							height: 2rem;
							font-weight: 600;
							font-size: 1.2rem;
							text-align: start;
						}
						.PageHomeFooter-section-item {
							width: 100%;
							height: 2rem;
							font-weight: 400;
							text-align: start;
							opacity: 1;

							color: inherit;
							text-decoration: none;

							&:hover {
								text-decoration: underline;
							}
						}
					}
				}
			}
		}

		.PageHomeFooter-credit {
			position: absolute;
			bottom: 0;
			left: 0;
			padding: 0.4rem;

			font-weight: 400;
			font-size: 0.8rem;
			color: white;
			opacity: 0.7;

			text-align: center;
			width: 100%;
		}
	}
</style>

<script>
	import Contact from "./Footer_Contact.vue";

	export default {
		components: { Contact },
		data() {
			return {
				contacts: [
					{
						title: "Office",
						subtitle: "014-631 5353",
						links: [
							{
								icon: this.host.res("icon/call-color.svg"),
								href: "tel:+60146315353",
							},
							{
								icon: this.host.res("icon/whatsapp-color.svg"),
								href: "https://api.whatsapp.com/send?phone=60146315353",
								target: "__blank,",
							},
							{
								icon: this.host.res("icon/telegram-color.svg"),
								href: "https://t.me/FreshnetEnterprise",
								target: "__blank",
							},
						],
					},
					{
						title: "Mr Beh",
						subtitle: "016-795 9444",
						links: [
							{
								icon: this.host.res("icon/call-color.svg"),
								href: "tel:+60167959444",
							},
							{
								icon: this.host.res("icon/whatsapp-color.svg"),
								href: "https://api.whatsapp.com/send?phone=60167959444",
								target: "__blank,",
							},
						],
					},
					// {
					// 	title: "Office",
					// 	subtitle: "03-3281 1526",
					// 	links: [
					// 		{
					// 			icon: this.host.res("icon/telephone-color.svg"),
					// 			href: "tel:+60332811526",
					// 		},
					// 	],
					// },
					{
						title: "Office",
						subtitle: "03-3289 7297",
						links: [
							{
								icon: this.host.res("icon/telephone-color.svg"),
								href: "tel:+60332897297",
							},
						],
					},
				],
			};
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
							href="https://maps.google.com/maps/dir//Freshnet+Enterprise+No.+14,+Ground+Floor+Jalan+Melati+3%2F3+Bandar+Melawati,+45000+Kuala+Selangor,+Selangor/@3.3296638,101.2565481,15z/data=!4m5!4m4!1m0!1m2!1m1!1s0x31ccf49e980c2d07:0xadf4850c7c433d0a"
							target="__blank"
							>No. 14, Ground Floor, Jalan Melati 3/3,<br />Bandar Melawati,
							45000,<br />Kuala Selangor, Selangor Darul Ehsan</a
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
		--primary-color: #b6c4ce;

		width: 100%;
		margin-top: 4rem;
		padding: 2rem;
		padding-bottom: 10rem;
		gap: 4rem;
		position: relative;

		text-decoration: none;
		background: black;
		background-color: var(--primary-color);
		color: white;
		color: #1b303d;

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
		}
	}
</style>

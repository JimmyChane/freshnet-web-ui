<script>
	import Company from "@/host/Company";

	export default {
		props: {
			product: { type: Object, default: () => null },
			isWide: { type: Boolean, default: false },
		},
		data() {
			return {
				whatsappLink: "",

				callTypeTitle: "",
				callTitle: "",
				callHref: "",
				callTarget: "",
				callIcon: "",

				whatsappTypeTitle: "",
				whatsappTitle: "",
				whatsappHref: "",
				whatsappTarget: "",
				whatsappIcon: "",
			};
		},
		watch: {
			product() {
				this.invalidate();
			},
		},
		mounted() {
			this.invalidate();
		},
		methods: {
			async invalidate() {
				const contact = Company.Contacts.findByTitle("Beh Aik Keong");

				const contactCall = contact.links.find(
					(link) => link.category.title === "Call",
				);
				this.callTypeTitle = contactCall.category.title;
				this.callTitle = contact.title;
				this.callHref = contactCall.toHtmlHref();
				this.callTarget = contactCall.toHtmlTarget();
				this.callIcon = contactCall.category.icon;

				const contactWhatsapp = contact.links.find(
					(link) => link.category.title === "Whatsapp",
				);
				this.whatsappTypeTitle = contactWhatsapp.category.title;
				this.whatsappTitle = contact.title;
				this.whatsappTarget = contactWhatsapp.toHtmlTarget();
				this.whatsappIcon = contactWhatsapp.category.icon;

				let { product } = this;
				if (!product) {
					this.whatsappHref = contactWhatsapp.toHtmlHref();
					return;
				}

				const productLink = this.product.getLink();
				const title = await product.fetchFullTitle();

				let text = `Hi, I am interested in this product`;
				if (title) text += `\n\n${title}`;
				if (productLink) text += `\n${productLink}`;
				const textUri = encodeURIComponent(text);

				this.whatsappHref = `${contactWhatsapp.toHtmlHref()}&text=${textUri}`;
			},
		},
	};
</script>

<template>
	<div :class="['Contacts', isWide ? 'Contacts-isWide' : 'Contacts-isThin']">
		<a
			class="Contacts-item"
			:href="callHref"
			:style="{
				'--primary-color': '#2196f3',
				'--primary-background-color': '#dff1ff',
			}"
		>
			<img class="Contacts-item-icon" :src="callIcon" />
			<div class="Contacts-item-body">
				<span class="Contacts-item-title">{{ callTypeTitle }}</span>
				<span class="Contacts-item-content">{{ callTitle }}</span>
			</div>
		</a>

		<a
			class="Contacts-item"
			:target="whatsappTarget"
			:href="whatsappHref"
			:style="{
				'--primary-color': '#4caf50',
				'--primary-background-color': '#f3fff4',
			}"
		>
			<img class="Contacts-item-icon" :src="whatsappIcon" />
			<div class="Contacts-item-body">
				<span class="Contacts-item-title">{{ whatsappTypeTitle }}</span>
				<span class="Contacts-item-content">{{ whatsappTitle }}</span>
			</div>
		</a>
	</div>
</template>

<style lang="scss" scoped>
	.Contacts {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-end;

		gap: 0.5rem;

		.Contacts-item {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;

			text-decoration: none;
			border: none;
			cursor: pointer;
			font-size: 1rem;
			font-weight: 400;
			line-height: 0.9rem;
			border-radius: 0.5rem;
			color: white;
			overflow: hidden;
			background-color: var(--primary-color);

			transition: var(--animation-duration);

			&:hover {
				background-color: var(--primary-background-color);
				color: var(--primary-color);
			}

			.Contacts-item-icon {
				grid-area: icon;
				width: 3rem;
				height: 3rem;
				padding: 1rem;
				grid-row: 1 / span 2;
				background-color: var(--primary-background-color);
			}
			.Contacts-item-body {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				padding: 0 1rem;
				.Contacts-item-title {
					grid-area: title;
					font-size: 0.8rem;
					display: flex;
					align-items: center;
				}
				.Contacts-item-content {
					grid-area: content;
				}
			}
		}
	}

	.Contacts-isThin {
		width: 100%;
		padding: 0 1rem;
	}
	.Contacts-isWide {
		padding: 0 1.5rem;
	}
</style>

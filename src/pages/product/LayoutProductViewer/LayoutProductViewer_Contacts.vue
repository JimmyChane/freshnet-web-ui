<script>
	export default {
		props: {
			product: { type: Object, default: () => null },
			isWide: { type: Boolean, default: false },
		},
		data() {
			return {
				whatsappLink: "",
			};
		},
		computed: {},
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
				this.whatsappLink = "";

				let phone = "60167959444";

				let { product } = this;
				if (!product) {
					this.whatsappLink = `https://api.whatsapp.com/send?phone=${phone}`;
					return;
				}

				const productLink = this.product.getLink();
				const title = await product.fetchFullTitle();

				let text = `Hi, I am interested in this product`;
				if (title) text += `\n\n${title}`;
				if (productLink) text += `\n${productLink}`;

				const textUri = encodeURIComponent(text);
				const phoneUri = encodeURIComponent(phone);

				this.whatsappLink = `https://api.whatsapp.com/send?phone=${phoneUri}&text=${textUri}`;
			},
		},
	};
</script>

<template>
	<div :class="['Contacts', isWide ? 'Contacts-isWide' : 'Contacts-isThin']">
		<a
			class="Contacts-item"
			href="tel:+60 16-795-9444"
			:style="{
				'--primary-color': '#2196f3',
				'--primary-background-color': '#dff1ff',
			}"
		>
			<img class="Contacts-item-icon" :src="host.res('icon/call-color.svg')" />
			<div class="Contacts-item-body">
				<span class="Contacts-item-title">Call</span>
				<span class="Contacts-item-content">Mr Beh</span>
			</div>
		</a>

		<a
			class="Contacts-item"
			target="__blank"
			:href="whatsappLink"
			:style="{
				'--primary-color': '#4caf50',
				'--primary-background-color': '#f3fff4',
			}"
		>
			<img
				class="Contacts-item-icon"
				:src="host.res('icon/whatsapp-color.svg')"
			/>
			<div class="Contacts-item-body">
				<span class="Contacts-item-title">Whatsapp</span>
				<span class="Contacts-item-content">Mr Beh</span>
			</div>
		</a>
	</div>
</template>

<style lang="scss" scoped>
	.Contacts {
		display: flex;
		flex-direction: row;
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
			font-weight: 900;
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

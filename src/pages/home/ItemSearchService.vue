<script>
	import ServiceState from "@/items/tools/ServiceState.js";

	export default {
		props: {
			item: { type: Object, default: null },
		},
		computed: {
			thumbnail: (c) => {
				const imageFiles = c.item ? c.item.imageFiles : [];
				const imageFile = imageFiles.length ? imageFiles[0] : null;
				return imageFile ? imageFile.toUrl({ height: 30 }) : "";
			},
			stateTitle: (c) => {
				const key = c.item ? c.item.state : "";
				const state = ServiceState.getResourceByKey(key);
				return state ? state.title : "";
			},
			title: (c) => {
				const customer = c.item ? c.item.customer : null;
				const name = customer ? customer.name : "";
				const phoneNumber = customer ? customer.phoneNumber : "";
				return `${name} ${phoneNumber}`;
			},
			description: (c) => (c.item ? c.item.description : ""),
		},
	};
</script>

<template>
	<div class="ItemSearchService">
		<div
			class="ItemSearchService-image"
			:class="[thumbnail ? '' : 'ItemSearchService-image-noImage']"
		>
			<img class="ItemSearchProduct-thumbnail" :src="thumbnail" />
		</div>
		<div class="ItemSearchService-body">
			<div class="ItemSearchService-labels">
				<span class="ItemSearchService-label">Service</span>
				<span class="ItemSearchService-label" v-if="stateTitle">{{
					stateTitle
				}}</span>
			</div>
			<span class="ItemSearchService-title">{{ title }}</span>
			<span class="ItemSearchService-subTitle">{{ description }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.ItemSearchService {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
		gap: 1em;
		padding: 0.5em;
		color: black;
		border-radius: 0.3em;
		font-size: 1.1em;

		.ItemSearchService-image {
			width: 3.5em;
			height: 3.5em;
			min-width: 3.5em;
			min-height: 3.5em;
			max-width: 3.5em;
			max-height: 3.5em;
			border-radius: 0.2em;
			.ItemSearchProduct-thumbnail {
				width: 3.5em;
				height: 3.5em;
				min-width: 3.5em;
				min-height: 3.5em;
				max-width: 3.5em;
				max-height: 3.5em;
				border-radius: 0.2em;
				object-fit: contain;
			}
		}
		.ItemSearchService-image-noImage {
			background: #ffffff80;
			.ItemSearchProduct-thumbnail {
				display: none;
			}
		}

		.ItemSearchService-body {
			min-height: 3.5em;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 0.3em;
			.ItemSearchService-labels {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				gap: 0.2em;
				.ItemSearchService-label {
					background: #ffffff80;
					font-size: 0.6em;
					padding: 0.4em 0.6em;
					border-radius: 0.3em;
				}
			}
			.ItemSearchService-title {
				font-weight: 900;
			}
			.ItemSearchService-subTitle {
				font-size: 0.8em;
				font-weight: 400;
				color: #808080;
			}
		}
	}
</style>

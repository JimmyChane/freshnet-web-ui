<script>
	import Item from "./PageHome-SectionContact-Group-Item.vue";

	export default {
		components: { Item },
		props: {
			isThin: { type: Boolean, default: false },
			group: { type: Object },
		},
		computed: {
			title: (c) => c.group.category.title,
			icon: (c) => c.group.category.icon,
			items: (c) => c.group.items,

			firstItem: (c) => (c.items.length > 0 ? c.items[0] : null),
			fisrtHref: (c) => (c.firstItem ? c.firstItem.href : ""),
			fisrtTarget: (c) => (c.firstItem ? c.firstItem.target : undefined),
		},
	};
</script>

<template>
	<a
		:class="['ContactGroup', `ContactGroup-${isThin ? 'isThin' : 'isWide'}`]"
		:href="fisrtHref"
		:target="fisrtTarget"
	>
		<div class="ContactGroup-main">
			<span class="ContactGroup-title">{{ title }}</span>
			<Item v-for="item of items" :key="item.title" :item="item" />
		</div>

		<img class="ContactGroup-icon" :src="icon" />
	</a>
</template>

<style lang="scss" scoped>
	.ContactGroup {
		overflow: hidden;
		color: black;
		text-decoration: none;
		position: relative;
		transition: var(--transition-duration);

		width: 100%;
		height: 100%;
		padding: 1em;
		padding-left: 1.2em;
		border-radius: 0.5em;
		gap: 1em;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: #f3f3f3;

		&:hover,
		&:focus {
			box-shadow: 0px 0px 1.5rem hsla(0, 0%, 0%, 0.1);
		}

		.ContactGroup-main {
			flex-grow: 1;
			height: 100%;
			gap: 0.5em;

			display: flex;
			flex-direction: column;
			align-items: stretch;

			.ContactGroup-title {
				font-weight: 600;
				font-size: 1em;
			}
		}
		.ContactGroup-icon {
			--size: 2.5em;
			--size: 4em;
			width: var(--size);
			height: var(--size);

			padding: 1em;
		}
	}
	.ContactGroup-isThin {
		font-size: 1rem;
	}
	.ContactGroup-isWide {
		font-size: 1.3rem;
	}
</style>

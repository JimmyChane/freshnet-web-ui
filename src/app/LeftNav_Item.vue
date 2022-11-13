<script>
	import ButtonIcon from "@/components/button/ButtonIcon.vue";

	export default {
		components: { ButtonIcon },
		props: {
			item: { type: Object, default: () => null },
			isSelectedDark: { type: Boolean, default: true },
			isWide: { type: Boolean, default: true },
		},
		computed: {
			icon() {
				if (!this.item || !this.item.icon) return null;
				return this.item.icon;
			},
			iconLight: (context) => (context.icon ? context.icon.light : ""),
			iconDark: (context) => (context.icon ? context.icon.dark : ""),
			iconUrl() {
				if (!this.isSelected) return this.iconDark;
				if (this.isSelectedDark) return this.iconLight;
				return this.iconDark;
			},
			title() {
				const title = this.item.title;
				if (this.isWide) return title;
				return title.substring(0, 1);
			},

			isSelected() {
				return this.item.isSelected();
			},
		},
	};
</script>

<template>
	<div :class="['LeftNavItem', `LeftNavItem-${isWide ? 'isWide' : 'isThin'}`]">
		<img class="LeftNavItem-icon" v-if="iconUrl" :src="iconUrl" />
		<span class="LeftNavItem-title" v-if="iconUrl ? isWide && title : true">{{
			title
		}}</span>
	</div>
</template>

<style lang="scss" scoped>
	.LeftNavItem {
		border: none;
		text-align: center;
		font-size: 1em;
		background: none;
		display: flex;
		flex-direction: row;
		gap: 1em;

		.LeftNavItem-icon {
			--size: 1.2em;
			width: var(--size);
			height: var(--size);
			min-width: var(--size);
			min-height: var(--size);
			max-width: var(--size);
			max-height: var(--size);
			object-fit: scale-down;
		}
		.LeftNavItem-title {
			--size: 1.2em;
			flex-grow: 1;
			min-height: var(--size);
			text-align: start;
			font-size: 1em;
			font-weight: 600;
			line-height: 1.2;
			color: inherit;

			display: flex;
			flex-direction: row;
			align-items: center;
		}
	}

	.LeftNavItem-isWide {
		width: 100%;
		justify-content: space-between;
	}
	.LeftNavItem-isThin {
		align-items: center;
		justify-content: center;
		.LeftNavItem-title {
			width: var(--size);
			height: var(--size);
			min-width: var(--size);
			min-height: var(--size);
			max-width: var(--size);
			max-height: var(--size);
			align-items: center;
			justify-content: center;
		}
	}
</style>

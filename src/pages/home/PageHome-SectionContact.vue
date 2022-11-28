<script>
	import Group from "./PageHome-SectionContact-Group.vue";
	import Company from "@/host/Company";

	export default {
		components: { Group },
		props: { isThin: { type: Boolean, default: false } },
		data() {
			return {
				items: [
					{
						title: "Beh Aik Keong",
						callNumber: "0167959444",
						whatsappNumber: "0167959444",
					},
					{
						title: "Office (Mobile)",
						callNumber: "0146315353",
						whatsappNumber: "0146315353",
						telegramName: "FreshnetEnterprise",
					},
					{
						title: "Office",
						phoneNumber: "0332897297",
						telephoneNumber: "0332897297",
					},
				],
			};
		},
		computed: {
			groups() {
				return Company.Contacts.toGroupsByCategory();
				return Company.Contacts.toGroupsByCategory().map((group) => {
					return {
						title: group.category.title,
						icon: group.category.icon,
						items: group.items,
					};
				});
			},
		},
	};
</script>

<template>
	<div
		:class="[
			'HomeSectionContact',
			`HomeSectionContact-${isThin ? 'isThin' : 'isWide'}`,
		]"
	>
		<Group
			v-for="group of groups"
			:key="group.title"
			:style="{
				'grid-column': 'auto / span 1',
				'grid-row': 'auto / span 2',
			}"
			:isThin="isThin"
			:group="group"
		/>
	</div>
</template>

<style lang="scss" scoped>
	.HomeSectionContact-isThin {
		font-size: 1rem;
	}
	.HomeSectionContact-isWide {
		font-size: 1.3rem;
	}
	.HomeSectionContact {
		width: 100%;
		gap: 0.5rem;

		display: grid;
		grid-auto-flow: row;
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));

		justify-content: center;
		align-items: center;
		justify-items: center;
		align-content: center;
	}
</style>

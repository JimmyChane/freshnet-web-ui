<script>
	export default {
		props: {
			isThin: { type: Boolean, default: false },
			title: { type: String, default: "" },
			description: { type: String, default: "" },
			links: { type: Array, default: () => [] },
		},
		computed: {
			firstLink() {
				return this.links.length ? this.links[0] : null;
			},
			titleClick() {
				if (!this.firstLink) return "";
				return `Click to ${this.firstLink.title}`;
			},
			href() {
				if (this.firstLink) {
					return this.firstLink.href;
				}
			},
			target() {
				if (this.firstLink) return this.firstLink.target;
			},
		},
	};
</script>

<template>
	<a
		:class="[
			'HomeSectionContact',
			`HomeSectionContact-${isThin ? 'isThin' : 'isWide'}`,
		]"
		:href="href"
		:target="target"
	>
		<div class="HomeSectionContact-main">
			<span class="HomeSectionContact-title">{{ title }}</span>

			<span class="HomeSectionContact-content">{{ description }}</span>

			<div class="HomeSectionContact-footer" v-if="titleClick && links.length">
				<span class="HomeSectionContact-click">{{ titleClick }}</span>

				<div class="HomeSectionContact-icons" v-if="links.length">
					<img
						class="HomeSectionContact-icon"
						v-for="link of links"
						:key="link.title"
						:src="link.icon"
						:alt="link.title"
					/>
				</div>
			</div>
		</div>
	</a>
</template>

<style lang="scss" scoped>
	.HomeSectionContact {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background: linear-gradient(101deg, #ad5dd3 0%, #742998 100%);

		aspect-ratio: 16/7;
		border-radius: 1em;
		overflow: hidden;
		color: white;

		text-decoration: none;
		position: relative;
		transition: var(--animation-duration);

		&:hover,
		&:focus {
			transform: scale(1.02);
			box-shadow: 0px 0px 1.5rem #742998;
			.HomeSectionContact-click {
				transition: var(--animation-duration);
			}
		}

		.HomeSectionContact-main {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			align-items: flex-start;
			padding: 2em;
			height: 100%;
			max-height: 12em;
			gap: 0.5em;
			z-index: 2;

			.HomeSectionContact-title {
				font-weight: 600;
				font-size: 1.9em;
			}
			.HomeSectionContact-content {
				font-size: 1.5em;
				display: flex;
				flex-flow: column nowrap;
				flex-flow: row nowrap;
				justify-content: space-between;
				gap: 0.2em;
			}
			.HomeSectionContact-footer {
				width: 100%;
				display: flex;
				flex-flow: row nowrap;
				flex-grow: 1;
				justify-content: space-between;
				align-items: flex-end;
				gap: 0.5em;
				.HomeSectionContact-click {
					display: flex;
					flex-direction: column;
					justify-content: flex-end;
					text-decoration: underline;
				}
				.HomeSectionContact-icons {
					font-size: 1.5em;
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 0.5em;
					.HomeSectionContact-icon {
						width: 1em;
						height: 1em;
					}
				}
			}
		}
		.HomeSectionContact-img {
			z-index: 1;
			height: calc(100% - 5em);
			aspect-ratio: 1/1;
			aspect-ratio: 3/2;
			object-fit: cover;
			position: absolute;
			right: 0;
			top: 0;
			bottom: 0;
			border-radius: 0.5rem;
			transition: var(--animation-duration);
		}
	}
	.HomeSectionContact-isThin {
		width: calc(100% - 2rem);
		height: 10rem;
		margin: 0 1rem;
		font-size: 0.8rem;
		.HomeSectionContact-img {
			margin: 2.5em 2em 2.5em 0;
		}
	}
	.HomeSectionContact-isWide {
		width: 100%;
		height: 100%;
		font-size: 1.2rem;
		.HomeSectionContact-img {
			margin: 2.5em 2.5em 2.5em 0;
		}
	}
</style>

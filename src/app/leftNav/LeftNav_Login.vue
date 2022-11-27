<script>
	export default {
		emits: ["click-logout"],
		props: { isWide: { type: Boolean, default: true } },
		data() {
			return { redirect: "" };
		},
		computed: {
			user: (context) => context.loginStore.getters.user,
			userName: (context) => (context.user ? context.user.name : ""),
			isLoginPage: (context) => context.$root.currentPageKey === "login",
		},
		watch: {
			$route() {
				this.invalidateRedirection();
			},
		},
		methods: {
			invalidateRedirection() {
				if (!this.isLoginPage) {
					this.redirect = this.$router.currentRoute.fullPath;
				}
			},
		},
		mounted() {
			this.invalidateRedirection();
			this.loginStore.dispatch("refresh");
		},
	};
</script>

<template>
	<div
		:class="[
			'LeftNavigationLogin',
			`LeftNavigationLogin-${isWide ? 'isWide' : 'isThin'}`,
		]"
		v-if="!isLoginPage || !user"
	>
		<div class="LeftNavigationLogin-loggedIn" v-if="user">
			<span class="LeftNavigationLogin-loggedIn-user">{{ userName }}</span>
			<div class="LeftNavigationLogin-loggedIn-body">
				<button
					class="LeftNavigationLogin-loggedIn-logout"
					@click="$emit('click-logout')"
				>
					<span>Logout</span>
				</button>
			</div>
		</div>

		<div class="LeftNavigationLogin-loggedOut" v-if="!isLoginPage && !user">
			<router-link
				class="LeftNavigationLogin-loggedOut-login"
				:to="{ path: '/login', query: { redirect } }"
			>
				<span>{{ isWide ? "Staff Login" : "Login" }}</span>
			</router-link>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.LeftNavigationLogin {
		flex-grow: 0;
		position: sticky;
		bottom: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
		// background: white;
		// background: #e2e9ed;
		padding: 1rem;
		border-top: 1px solid hsla(0, 0%, 0%, 0.1);

		.LeftNavigationLogin-loggedIn {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;
			.LeftNavigationLogin-loggedIn-user {
				font-size: 0.8rem;
			}
			.LeftNavigationLogin-loggedIn-body {
				border-radius: 6px;
				background-color: white;
				display: flex;
				flex-direction: row;
				align-items: center;
				.LeftNavigationLogin-loggedIn-logout {
					width: 100%;
					flex-grow: 1;
					border-radius: 0.5em;
					border: none;
					cursor: pointer;
					padding: 0.4em;
					transition: 0.1s;
					color: white;

					--accent-color: #ca4242;

					background-color: var(--primary-color);

					&:hover {
						background-color: var(--accent-color);
					}
				}
			}
		}
		.LeftNavigationLogin-loggedOut {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;
			.LeftNavigationLogin-loggedOut-login {
				width: 100%;
				border-radius: 6px;
				border: none;
				cursor: pointer;
				padding: 0.3em;
				transition: var(--animation-duration);

				display: flex;
				text-decoration: none;
				align-items: center;
				justify-content: center;

				--primary-color: #2683d8;

				background: none;
				border: 0.1em solid var(--primary-color);
				color: var(--primary-color);
				font-size: 0.8rem;

				&:hover,
				&:focus {
					background: var(--primary-color);
					color: white;
				}
			}
		}
	}

	.LeftNavigationLogin-isWide {
		padding: 1rem;
	}
	.LeftNavigationLogin-isThin {
		// padding: 0;
		padding: 0.2rem;
		.LeftNavigationLogin-loggedIn {
			gap: 0;
			.LeftNavigationLogin-loggedIn-user {
				padding: 0.2rem;
				text-align: center;
			}
			.LeftNavigationLogin-loggedIn-body {
				.LeftNavigationLogin-loggedIn-logout {
					border-radius: 0.2rem;
				}
			}
		}
		.LeftNavigationLogin-loggedOut {
			.LeftNavigationLogin-loggedOut-login {
				border-radius: 0.2rem;
				border: none;
			}
		}
	}
</style>

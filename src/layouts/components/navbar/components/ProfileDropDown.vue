<template>
  <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo">

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ activeUserInfo.name }}</p>
      <small>Último acceso: {{dateTimeFormat(activeUserInfo.lastSingIn)}}</small>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">

      <div class="con-img ml-3">
        <!-- <img :src="imgURL" alt="Drink&Go" key="onlineImg" width="150" height="25" class="cursor-pointer block"> -->
        <img v-if="imgURL" key="onlineImg" :src="imgURL" alt="user-img" width="40" height="40" class="" />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown" v-if="!loggedOut">
        <ul style="min-width: 9rem">

          <!-- <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Profile</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="MailIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Inbox</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Tasks</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Chat</span>
          </li>

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="HeartIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Wish List</span>
          </li>

          <vs-divider class="m-1" /> -->

          <li
            @click.stop="logout()"
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Cerrar sesión</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import store from '../../../../store/store.js'
export default {
  data () {
    return {
      imgURL: require("@/assets/images/logo/dg_logo.png"),
      loggedOut: false,
    }
  },
  computed: {
    activeUserInfo () {
      return store.getters["auth/getUser"]
    }
  },
  methods: {
    async logout () {
      this.showFullPageLoader();
      this.loggedOut = true;
      await this.timeout(600);
      await this.executeAppLogout();
    },
    timeout(ms){
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
}
</script>

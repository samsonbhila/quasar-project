<template>
  <q-layout view="lHh Lpr lFf" class="layout-background">
    <q-header elevated class="header-background">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Advanced Data Visualization 
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      behavior="overlay" 
      class="drawer-background"
    >
    
      <q-list>
        
        <!-- Image logo -->
      <q-img
        src="/images/Technologies-Logo.png"
        alt="Sedibelo Logo"
        style="max-width: 150px; max-height: 100px;"
      />

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
          class="essential-link"
        />
      </q-list>
    </q-drawer>

    <q-page-container class="page-background">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style>
.layout-background {
  background-color: #f6efef !important; /* Use !important to ensure this style takes precedence */
  min-height: 100vh; /* Ensure the layout takes full height */
}

.header-background {
  background-color: #125053; /* Change to desired header color */
  color: rgb(82, 81, 81); /* Change text color for header */
}

.drawer-background {
  background-color: #125053; /* Change to desired drawer color */
}

.page-background {
  background-color: #ebebeb; /* Change to desired page color */
  min-height: 100vh; /* Ensure it covers full height */
}

/* New styles for EssentialLink */
.essential-link {
  color: #fcfbfb; /* Change this to your desired text color */
  padding: 10px; /* Add some padding */
  border-radius: 4px; /* Rounded corners */
}

.essential-link:hover {
  background-color: #e0e0e0; /* Change this to desired hover background color */
  color: #000; /* Change this to desired hover text color */
}
</style>

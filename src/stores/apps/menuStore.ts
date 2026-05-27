import { BriefcaseOutline, CartOutline, PeopleOutline, PersonCircleOutline, PersonOutline, ShieldCheckmarkOutline, StatsChartOutline, StorefrontOutline } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { defineStore } from 'pinia'
import type { Component, Ref } from 'vue'

interface MenuState {
  data: {
    menuOptions: MenuOption[]
  }
  feature: {
    inverted: boolean
  }
}

const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export const useMenuStore = defineStore('menuStore', () => {
  const router = useRouter()

  const state: Ref<MenuState> = ref({
    data: {
      menuOptions: []
    },
    feature: {
      inverted: false
    }
  })

  state.value.data.menuOptions = [
    {
      label: 'User',
      key: 'a-user',
      icon: renderIcon(PersonOutline),
      onClick: () => router.push('/C/user')
    },
    {
      label: 'Admin',
      key: 'a-admin',
      icon: renderIcon(ShieldCheckmarkOutline),
      children: [
        {
          label: 'Member',
          key: 'a-admin-member',
          icon: renderIcon(PersonCircleOutline),
          onClick: () => router.push('/C/admin/member')
        },
        {
          label: 'Store',
          key: 'a-admin-store',
          icon: renderIcon(StorefrontOutline),
          onClick: () => router.push('/C/admin/store')
        }
      ]
    },
    {
      label: 'Manager',
      key: 'a-manager',
      icon: renderIcon(BriefcaseOutline),
      children: [
        {
          label: 'Account',
          key: 'a-manager-account',
          icon: renderIcon(PersonCircleOutline),
          onClick: () => router.push('/C/manager/Cccount')
        },
        {
          label: 'Performance',
          key: 'a-manager-performance',
          icon: renderIcon(StatsChartOutline),
          onClick: () => router.push('/C/manager/performance')
        }
      ]
    },
    {
      label: 'Staff',
      key: 'a-staff',
      icon: renderIcon(PeopleOutline),
      children: [
        {
          label: 'User',
          key: 'a-staff-user',
          icon: renderIcon(PersonOutline),
          onClick: () => router.push('/C/staff/user')
        },
        {
          label: 'Checkout',
          key: 'a-staff-checkout',
          icon: renderIcon(CartOutline),
          onClick: () => router.push('/C/staff/checkout')
        }
      ]
    }
  ]

  const menuOptions = computed(() => state.value.data.menuOptions)
  const inverted = computed(() => state.value.feature.inverted)

  return {
    state,
    menuOptions,
    inverted
  }
})

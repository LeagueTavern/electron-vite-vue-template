import { defineComponent } from 'vue'
import MainContainer from './layouts/main-container'
import MainWindow from './layouts/main-window'
import HeaderView from './components/header'

export default defineComponent({
  components: {
    MainContainer,
    MainWindow
  },
  props: {},
  setup() {
    return () => (
      <>
        <MainWindow
          v-slots={{
            header: () => <HeaderView title="Danmacat Desktop" />
          }}
        >
          <MainContainer />
        </MainWindow>
      </>
    )
  }
})

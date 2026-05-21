import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'sj84f28g',
    dataset: 'production',
  },
  /**
   * Falls du das Studio später unter einem eigenen Subdomain
   * deployen willst (z. B. https://portfolio-azin.sanity.studio):
   *   npm run deploy
   */
  // studioHost: 'portfolio-azin',
})

import {ApplicationContract} from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {
  }

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const {MyHashDriver} = await import('./HashDriver');
    const Hash = this.app.container.use('Adonis/Core/Hash');

    Hash.extend('MyHashDriver', () => {
      return new MyHashDriver()
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}

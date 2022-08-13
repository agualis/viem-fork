// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from '../../package.json'

/* c8 ignore next */
const version = <any>process.env.TEST ? '1.0.2' : pkg.version

export class BaseError extends Error {
  details: string

  constructor({
    humanMessage,
    details,
    docsLink,
  }: {
    humanMessage: string
    details: string
    docsLink?: string
  }) {
    super(
      [
        humanMessage,
        ...(docsLink ? ['', 'Docs: ' + docsLink] : []),
        '',
        'Details: ' + details,
        'Version: viem@' + version,
      ].join('\n'),
    )
    this.details = details
  }
}
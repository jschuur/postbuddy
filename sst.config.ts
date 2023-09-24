import { boolean } from 'boolean';
import pc from 'picocolors';
import { SSTConfig } from 'sst';
import { Cron, NextjsSite } from 'sst/constructs';

export default {
  config(_input) {
    return {
      name: 'postbuddy',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    const path = app.stage === 'production' ? '.env.production' : '.env.local';
    console.log(` using ${pc.cyan(path)}`);
    const customDomain =
      process.env.SITE_DOMAIN_ZONE && process.env.SITE_DOMAIN
        ? {
            domainName: process.env.SITE_DOMAIN,
            hostedZone: process.env.SITE_DOMAIN_ZONE,
          }
        : undefined;

    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, 'site', {
        customDomain,
      });

      if (!process.env.DB_URL) throw Error('Missing DB_URL');
      if (!process.env.CLERK_SECRET_KEY) throw Error('Missing CLERK_SECRET_KEY');

      const cronDisabled = process.env.IS_LOCAL || boolean(process.env.CRON_DISABLED);
      console.log(` cron: ${cronDisabled ? pc.red('disabled') : pc.green('enabled')}`);

      new Cron(stack, 'cron', {
        schedule: 'rate(1 hour)',
        job: {
          function: {
            handler: 'src/functions/update.handler',
            timeout: 900,
            environment: {
              DB_URL: process.env.DB_URL,
              CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
            },
          },
        },
        enabled: !cronDisabled,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;

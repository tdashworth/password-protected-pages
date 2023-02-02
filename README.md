# Password Protected Pages (on vercel)

## Demo

URL: https://password-protected-pages.vercel.app

| Site Slug | Password    |
| --------- | ----------- |
| example   | hello world |
| project-1 | test123     |

## Setup

### App config

```json
{
  "sites": [
    {
      // REQUIRED. The base URL path to the site,
      "slug": "example",
      // REQUIRED. The password hashed using `npm run hash-password "site-slug" "secure password"`
      "passwordHash": "c7a765219000add2a6e2031bccd84a64f7878fd8cb3ee58767523d1969c41693",
      // OPTIONAL. Wether the site is accessible or not. Defaults to true/yes.
      "live": true,
      // OPTIONAL. How long in days before the user has to sign back in. Defaults to 1.
      "signInExpiryInDays": 1
    }
  ]
}
```

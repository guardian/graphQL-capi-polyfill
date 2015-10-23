# GraphQL "Polyfill" for CAPI

An example of a GraphQL server using the existing CAPI REST server.

The Schemas are far from complete so not all data is accessible yet, but should be a starting point for supporting the rest of CAPI.

## Setup

1. Copy `config.example.js` to `config.js` and add a CAPI URL
2. run `npm install`
3. run `npm start`

## Usage

The server should be running at [http://localhost:3000](http://localhost:3000) and you can direct your queries there.

Alternatively... use the nice GUI.

Visit [http://localhost:3000](http://localhost:3000) in a browser.

Here's some example queries.

### Get the headline of a specific article
```
{
	article(path: "business/2015/oct/23/talktalk-cyber-attack-company-unsure-how-many-users-affected") {
    headline
  }
}
```

### Get the a few more details for a specific article

```
{
	article(path: "business/2015/oct/23/talktalk-cyber-attack-company-unsure-how-many-users-affected") {
    headline,
    sectionName,
    url,
  }
}
```

### Get related articles and their headlines

```
{
	article(path: "business/2015/oct/23/talktalk-cyber-attack-company-unsure-how-many-users-affected") {
    headline,
    sectionName,
    url,
    relatedArticles {
      headline
    }
  }
}
```

### Get the main image with a width of 1000px

```
{
	article(path: "business/2015/oct/23/talktalk-cyber-attack-company-unsure-how-many-users-affected") {
    headline,
    sectionName,
    url,
    mainImage(width: 1000) {
      url,
      alt
    }
  }
}
```

#Get the main image for the specific article at 1000px and the related articles at 200px

```
{
	article(path: "business/2015/oct/23/talktalk-cyber-attack-company-unsure-how-many-users-affected") {
    headline,
    sectionName,
    url,
    mainImage(width: 1000) {
      url,
      alt
    },
    relatedArticles {
      headline,
      url,
      mainImage(width: 200) {
        url,
        alt
      }
    }
  }
}
```

#Get the newest articles and their headlines

```
{
	newest {
    headline,
    url
  }
}
```

#The above image command but for all the newest articles

```
{
	newest {
    headline,
    sectionName,
    url,
    mainImage(width: 1000) {
      url,
      alt
    },
    relatedArticles {
      headline,
      url,
      mainImage(width: 200) {
        url,
        alt
      }
    }
  }
}

```

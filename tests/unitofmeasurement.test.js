const { preProcessApiLink, getUoMFromFintoApi } = require( '../services/unitofmeasurement' );
const got = require( 'got' );
const uomlist = [ 'http://finto.fi/ucum/en/page/r63', 'http://finto.fi/ucum/en/page/r59', 'http://finto.fi/ucum/en/page/r57', 'http://finto.fi/ucum/en/page/r73', 'http://finto.fi/ucum/en/page/r61', 'http://finto.fi/mesh/en/page/D052638' ]

describe( "pre processing api link", () => {

    test( 'Ucum values', () => {

        for ( let i = 0, len = uomlist.length - 1; i < len; i++ ) {
            expect( preProcessApiLink( uomlist[ i ] ) ).toContain( 'https://finto.fi/rest/v1/ucum/data?uri=http%3A%2F%2Furn.fi%2FURN%3ANBN%3Afi%3Aau%3Aucum%3Ar' );
            expect( preProcessApiLink( uomlist[ i ] ) ).toContain( '&format=application/ld%2Bjson' );
        }

    } )

    test( 'Mesh value', () => {

        expect( preProcessApiLink( uomlist.pop() ) ).toEqual( 'https://finto.fi/rest/v1/mesh/data?uri=http%3A%2F%2Fwww.yso.fi%2Fonto%2Fmesh%2FD052638&format=application/ld%2Bjson' );

    } )
    
})

describe( "Getting get UoM from finto api", () => {

    jest.mock( 'got' );

    test( 'https://finto.fi/ucum/en/page/r59', async () => {

        got.get = jest.fn().mockReturnValue({
            json: () => Promise.resolve(
                {
                    "@context":{
                       "skos":"http://www.w3.org/2004/02/skos/core#",
                       "isothes":"http://purl.org/iso25964/skos-thes#",
                       "rdfs":"http://www.w3.org/2000/01/rdf-schema#",
                       "owl":"http://www.w3.org/2002/07/owl#",
                       "dct":"http://purl.org/dc/terms/",
                       "dc11":"http://purl.org/dc/elements/1.1/",
                       "uri":"@id",
                       "type":"@type",
                       "lang":"@language",
                       "value":"@value",
                       "graph":"@graph",
                       "label":"rdfs:label",
                       "prefLabel":"skos:prefLabel",
                       "altLabel":"skos:altLabel",
                       "hiddenLabel":"skos:hiddenLabel",
                       "broader":"skos:broader",
                       "narrower":"skos:narrower",
                       "related":"skos:related",
                       "inScheme":"skos:inScheme",
                       "exactMatch":"skos:exactMatch",
                       "closeMatch":"skos:closeMatch",
                       "broadMatch":"skos:broadMatch",
                       "narrowMatch":"skos:narrowMatch",
                       "relatedMatch":"skos:relatedMatch"
                    },
                    "graph":[
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:Unit",
                          "type":"owl:Class",
                          "prefLabel":{
                             "lang":"en",
                             "value":"unit"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:p1",
                          "label":{
                             "lang":"en",
                             "value":"code"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:p2",
                          "label":{
                             "lang":"en",
                             "value":"CODE"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:p3",
                          "label":{
                             "lang":"en",
                             "value":"isMetric"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:p5",
                          "label":{
                             "lang":"en",
                             "value":"value"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r47",
                          "type":"skos:Collection",
                          "skos:member":{
                             "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r59"
                          },
                          "prefLabel":{
                             "lang":"en",
                             "value":"si"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r59",
                          "type":[
                             "http://urn.fi/URN:NBN:fi:au:ucum:Unit",
                             "skos:Concept"
                          ],
                          "http://urn.fi/URN:NBN:fi:au:ucum:p1":{
                             "lang":"en",
                             "value":"W"
                          },
                          "http://urn.fi/URN:NBN:fi:au:ucum:p2":{
                             "lang":"en",
                             "value":"W"
                          },
                          "http://urn.fi/URN:NBN:fi:au:ucum:p3":{
                             "lang":"en",
                             "value":"yes"
                          },
                          "http://urn.fi/URN:NBN:fi:au:ucum:p5":{
                             "lang":"en",
                             "value":"1 in J/s"
                          },
                          "broader":{
                             "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r60"
                          },
                          "inScheme":"http://urn.fi/URN:NBN:fi:au:ucum:",
                          "prefLabel":{
                             "lang":"en",
                             "value":"watt"
                          }
                       },
                       {
                          "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r60",
                          "type":"skos:Concept",
                          "narrower":{
                             "uri":"http://urn.fi/URN:NBN:fi:au:ucum:r59"
                          },
                          "prefLabel":{
                             "lang":"en",
                             "value":"power"
                          }
                       }
                    ]
                })
            })
        
          const uom = await getUoMFromFintoApi( 'https://finto.fi/ucum/en/page/r59' );
          expect( uom ).toEqual( 'watt' );

    } )

    test( 'http://finto.fi/mesh/en/page/D052638', async () => {

        got.get = jest.fn().mockReturnValue({
            json: () => Promise.resolve(
                {
                    "@context":{
                       "skos":"http://www.w3.org/2004/02/skos/core#",
                       "isothes":"http://purl.org/iso25964/skos-thes#",
                       "rdfs":"http://www.w3.org/2000/01/rdf-schema#",
                       "owl":"http://www.w3.org/2002/07/owl#",
                       "dct":"http://purl.org/dc/terms/",
                       "dc11":"http://purl.org/dc/elements/1.1/",
                       "uri":"@id",
                       "type":"@type",
                       "lang":"@language",
                       "value":"@value",
                       "graph":"@graph",
                       "label":"rdfs:label",
                       "prefLabel":"skos:prefLabel",
                       "altLabel":"skos:altLabel",
                       "hiddenLabel":"skos:hiddenLabel",
                       "broader":"skos:broader",
                       "narrower":"skos:narrower",
                       "related":"skos:related",
                       "inScheme":"skos:inScheme",
                       "exactMatch":"skos:exactMatch",
                       "closeMatch":"skos:closeMatch",
                       "broadMatch":"skos:broadMatch",
                       "narrowMatch":"skos:narrowMatch",
                       "relatedMatch":"skos:relatedMatch"
                    },
                    "graph":[
                       {
                          "uri":"http://www.yso.fi/onto/mesh/",
                          "type":"skos:ConceptScheme",
                          "label":"Medical Subject Headings (MeSH)"
                       },
                       {
                          "uri":"http://www.yso.fi/onto/mesh/D004391",
                          "type":"skos:Concept",
                          "broader":{
                             "uri":"http://www.yso.fi/onto/mesh/D052638"
                          },
                          "prefLabel":[
                             {
                                "lang":"sv",
                                "value":"Damm"
                             },
                             {
                                "lang":"en",
                                "value":"Dust"
                             },
                             {
                                "lang":"fi",
                                "value":"pöly"
                             }
                          ]
                       },
                       {
                          "uri":"http://www.yso.fi/onto/mesh/D010316",
                          "type":"skos:Concept",
                          "prefLabel":[
                             {
                                "lang":"sv",
                                "value":"Partikelstorlek"
                             },
                             {
                                "lang":"en",
                                "value":"Particle Size"
                             },
                             {
                                "lang":"fi",
                                "value":"hiukkaskoko"
                             }
                          ],
                          "related":{
                             "uri":"http://www.yso.fi/onto/mesh/D052638"
                          }
                       },
                       {
                          "uri":"http://www.yso.fi/onto/mesh/D012905",
                          "type":"skos:Concept",
                          "broader":{
                             "uri":"http://www.yso.fi/onto/mesh/D052638"
                          },
                          "prefLabel":[
                             {
                                "lang":"sv",
                                "value":"Rökblandad dimma"
                             },
                             {
                                "lang":"fi",
                                "value":"savusumu"
                             },
                             {
                                "lang":"en",
                                "value":"Smog"
                             }
                          ]
                       },
                       {
                          "uri":"http://www.yso.fi/onto/mesh/D012906",
                          "type":"skos:Concept",
                          "broader":{
                             "uri":"http://www.yso.fi/onto/mesh/D052638"
                          },
                          "prefLabel":[
                             {
                                "lang":"sv",
                                "value":"Rök"
                             },
                             {
                                "lang":"en",
                                "value":"Smoke"
                             },
                             {
                                "lang":"fi",
                                "value":"savu"
                             }
                          ]
                       },
                       {
                          "uri":"http://www.yso.fi/onto/mesh/D045424",
                          "type":"skos:Concept",
                          "narrower":{
                             "uri":"http://www.yso.fi/onto/mesh/D052638"
                          },
                          "prefLabel":[
                             {
                                "lang":"sv",
                                "value":"Komplexa blandningar"
                             },
                             {
                                "lang":"fi",
                                "value":"koostumukseltaan vaihtelevat seokset"
                             },
                             {
                                "lang":"en",
                                "value":"Complex Mixtures"
                             }
                          ]
                       },
                       {
                          "uri":"http://www.yso.fi/onto/mesh/D052638",
                          "type":"skos:Concept",
                          "dct:created":{
                             "type":"http://www.w3.org/2001/XMLSchema#date",
                             "value":"2006-07-05"
                          },
                          "dct:modified":{
                             "type":"http://www.w3.org/2001/XMLSchema#date",
                             "value":"2021-05-03"
                          },
                          "altLabel":{
                             "lang":"fi",
                             "value":"hengitettävät hiukkaset"
                          },
                          "broader":{
                             "uri":"http://www.yso.fi/onto/mesh/D045424"
                          },
                          "skos:historyNote":{
                             "lang":"en",
                             "value":"2007"
                          },
                          "inScheme":{
                             "uri":"http://www.yso.fi/onto/mesh/"
                          },
                          "narrower":[
                             {
                                "uri":"http://www.yso.fi/onto/mesh/D012905"
                             },
                             {
                                "uri":"http://www.yso.fi/onto/mesh/D004391"
                             },
                             {
                                "uri":"http://www.yso.fi/onto/mesh/D012906"
                             },
                             {
                                "uri":"http://www.yso.fi/onto/mesh/D060729"
                             }
                          ],
                          "prefLabel":[
                             {
                                "lang":"fi",
                                "value":"pienhiukkaset"
                             },
                             {
                                "lang":"en",
                                "value":"Particulate Matter"
                             },
                             {
                                "lang":"sv",
                                "value":"Luftburna partiklar"
                             }
                          ],
                          "related":{
                             "uri":"http://www.yso.fi/onto/mesh/D010316"
                          },
                          "skos:scopeNote":{
                             "lang":"en",
                             "value":"Particles of any solid substance, generally under 30 microns in size, often noted as PM30. There is special concern with PM1 which can get down to PULMONARY ALVEOLI and induce MACROPHAGE ACTIVATION and PHAGOCYTOSIS leading to FOREIGN BODY REACTION and LUNG DISEASES."
                          }
                       },
                       {
                          "uri":"http://www.yso.fi/onto/mesh/D060729",
                          "type":"skos:Concept",
                          "broader":{
                             "uri":"http://www.yso.fi/onto/mesh/D052638"
                          },
                          "prefLabel":[
                             {
                                "lang":"sv",
                                "value":"Kolaska"
                             },
                             {
                                "lang":"fi",
                                "value":"hiilituhka"
                             },
                             {
                                "lang":"en",
                                "value":"Coal Ash"
                             }
                          ]
                       }
                    ]
                })
            })
        
          const uom = await getUoMFromFintoApi( 'http://finto.fi/mesh/en/page/D052638' );
          expect( uom ).toEqual( 'particulate matter' );

    } )
    
})
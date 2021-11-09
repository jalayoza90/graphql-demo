const express = require("express");
const expressGraphQl = require("express-graphql").graphqlHTTP;
const app = express();

const authors = [
    { id: 1, name: "name 1"},
    { id: 2, name: "name 2"},
    { id: 3, name: "name 3"}
];

const books = [
    {id: 1, name: "book 1", authorId:1},
    {id: 2, name: "book 2", authorId:1},
    {id: 3, name: "book 3", authorId:2},
    {id: 4, name: "book 4", authorId:2},
    {id: 5, name: "book 5", authorId:3}
];

const { 
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require("graphql");

const RouteQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Route Query",
    fields: () => ({
        book: {
            type: BookType,
            description: "List of all books",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id ) 
        },
        books: {
            type: new GraphQLList(BookType),
            description: "List of all books",
            resolve: () => books 
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of all Authors",
            resolve: () => authors 
        },
        author: {
            type: AuthorType,
            description: "List of all Authors",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(auhtor => auhtor.id === args.id ) 
        }
    })
});

const BookType = new GraphQLObjectType({
    name: "Book",
    description: "This represents books of written by an author",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "This represents a author of a book",
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) =>{
                return books.filter(bookd => bookd.authorId === author.id )
            }
        }
    })
});

const schema = new GraphQLSchema({
    query: RouteQueryType
})

app.use('/graphql', expressGraphQl({
    schema: schema,
    graphiql:true
}));
app.listen(5000,() => { console.log("server is running"); });
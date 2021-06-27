module.exports = {
    fields: {
        name: "text",
        address: "text",
        phone: "int",
        email: "text"
    },
    key: ["email"],
    es_index_mapping: {
        discover: '.*',
    },
    graph_mapping: {
        relations: {
          follow: 'MULTI',
          mother: 'MANY2ONE',
        },
        properties: {
          email: {
            type: 'String',
            cardinality: 'SINGLE',
          },
          name: {
            type: 'String',
            cardinality: 'SINGLE',
          },
          address: {
            type: 'String',
            cardinality: 'SINGLE',
          },
          phone: {
            type: 'Integer',
            cardinality: 'SINGLE',
          },          
          followedAt: {
            type: 'Long',
            cardinality: 'SINGLE',
          },
        },
        indexes: {
          byEmailComposite: {
            type: 'Composite',
            keys: ['email'],
            unique: true,
          },
          byNameComposite: {
            type: 'Composite',
            keys: ['name'],
          },
          byNameAddressgeComposite: {
            type: 'Composite',
            keys: ['name', 'address'],
          },
          byEmailNameAgeMixed: {
            type: 'Mixed',
            keys: ['email', 'name', 'address'],
          },
          byFollowedAtVertexCentric: {
            type: 'VertexCentric',
            keys: ['followedAt'],
            label: 'follow',
            direction: 'BOTH',
            order: 'decr',
          },
        },
      },
}
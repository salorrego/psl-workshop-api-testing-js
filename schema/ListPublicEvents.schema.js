const listPublicEventsSchema = {
    title: 'Public event Schema V1.0.0',
    type: 'object',
    requiered: ['status'],
    properties: {
        status: {
            type: 'number',
            minimum: 100,
            maximum: 599
        },
        body: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: {type: 'string'},
                    type: {type: 'string'},
                    actor: { 
                        type: 'object',
                        properties: {
                            id: {type:'number'},
                            login: {type:'string'},
                            display_login: {type:'string'},
                            gravatar_id: {type:'string'},
                            url: {type:'string'},
                            avatar_url: {type:'string'}
                        }
                    },
                    public: {type: 'boolean'},
                    repo: {
                        type: 'object',
                        properties: {
                            id: {type: 'number'},
                            name: {type:'string'},
                            url: {type: 'string'}
                        }
                    },
                    payload: {
                        type: 'object',
                        properties: {
                            action: {type:'string'},
                            issue: {
                                type: 'object',
                                properties: {
                                    url: {type:'string'},
                                    repository_url: {type:'string'},
                                    labels_url: {type:'string'},
                                    comments_url: {type:'string'},
                                    events_url: {type:'string'},
                                    html_url: {type:'string'},
                                    id: {type:'number'},
                                    number: {type:'number'},
                                    title: {type:'string'},
                                    user: {
                                        type: 'object',
                                        properties: {
                                            login: {type:'string'},
                                            id: {type:'number'},
                                            avatar_url: {type:'string'},
                                            gravatar_url: {type:'string'},
                                            url: {type:'string'},
                                            html_url: {type:'string'},
                                            followers_url: {type:'string'},
                                            following_url: {type:'string'}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
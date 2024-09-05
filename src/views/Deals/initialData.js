export const initialData={
    deals:{
        'deals-1':{id:'deals-1',title:'deals 1'},
        'deals-2':{id:'deals-2',title:'deals 2'},
        'deals-3':{id:'deals-3',title:'deals 3'},
        'deals-4':{id:'deals-4',title:'deals 4'},
    },
    cards:{
        'lead-in':{
            id:'lead-in',
            card_probability:'0.1',
            title:'Lead in',
            dealsId:['deals-1','deals-2','deals-3','deals-4'],
        },
        'proposal-development':{
            card_probability:'0.2',
            id:'proposal-development',
            title:'Proposal Development',
            dealsId:[]
        },
        'proposal-made':{
            card_probability:'0.3',
            id:'proposal-made',
            title:'Proposal Made',
            dealsId:[]
        },
        'presentation':{
            card_probability:'0.5',
            id:'presentation',
            title:'Presentation',
            dealsId:[]
        },
        'negotiations':{
            card_probability:'0.6',
            id:'negotiations',
            title:'Negotiations',
            dealsId:[]
        },
    
    },
    cardOrder:['lead-in','proposal-development','proposal-made','presentation','negotiations']
}
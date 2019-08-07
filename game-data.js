module.exports = {
    gamestates : {
        'waiting': 0,
        'starting': 1,
        'building': 2,
        'battlestarting': 3,
        'battle': 4,
        'end': 5
    },
    basestats : {
        maxhp: 1200,
        dmg: 40,
        evasion: 0,
        reflect: 0,
        critdmg: 200,
        critrate: 15,
        lifesteal: 0,
        regen: 0,
        bleed: 0,
        atkspd: 1000,
        dmgreduction: 0,
        amplify: 0,
    },
    elementdmg: 25,
    icons: [
        '1','2','3','4','5','6','7','8','9','10', '11', '12'
    ],
    elements: [
        {
            title : 'Earth',
            strength: 'Wind',
        },
        {
            title : 'Wind',
            strength: 'Water',
        },
        {
            title : 'Water',
            strength: 'Fire',
        },
        {
            title : 'Fire',
            strength: 'Earth',
        }
    ],
    strengths: [
        {
            title: '+50% Evasion',
            effect: { property: 'evasion', amount: 50 }
        },
        {
            title: 'Reflect 20% dmg',
            effect: { property: 'reflect', amount: 20 }
        },
        {
            title: '+200% crit dmg',
            effect: { property: 'critdmg', amount: 200 }
        },
        {
            title: '+25% extra dmg',
            effect: { property: 'dmg', amount: 25 }
        },
        {
            title: '+25% life steal',
            effect: { property: 'lifesteal', amount: 25 }
        },
        {
            title: '+5% hp regen/sec',
            effect: { property: 'regen', amount: 5 }
        },
        {
            title: '+50% hp',
            effect: { property: 'maxhp', amount: 50, multiply: true }
        },
        {
            title: '+10% crit rate',
            effect: { property: 'critrate', amount: 10 }
        },
        {
            title: '+10% atk speed',
            effect: { property: 'atkspd', amount: 10, multiply: true }
        },
    ],
    weaknesses: [
        {
            title: 'Take 50% more dmg',
            effect: { property: 'amplify', amount: 50 }
        },
        {
            title: 'Bleed 2% hp/sec',
            effect: { property: 'bleed', amount: 50 }
        },
        {
            title: '-50% Max HP',
            effect: { property: 'maxhp', amount: -50, multiply: true }
        },
        {
            title: '-25% dmg',
            effect: { property: 'dmg', amount: -25, multiply: true }
        },
        {
            title: '-25% Crit Dmg',
            effect: { property: 'critdmg', amount: -25 }
        },
        {
            title: '-10% Crit Rate',
            effect: { property: 'critrate', amount: -10 }
        },
        {
            title: '-10% Atk Speed',
            effect: { property: 'atkspeed', amount: -10, multiply: true }
        },
    ]
}
export interface ButtonData {
    id: string;
    name: string;
    icon: string;
    cost: number;
    description: string;
    type: string;
}

export const housingButtonData = [
    {
        id: 'apartment',
        name: 'Apartment',
        icon: 'apartment',
        cost: 100,
        description: 'A small apartment building.',
        type: 'housing',
    },
    {
        id: 'bunkhouse',
        name: 'Bunkhouse',
        icon: 'bunkhouse',
        cost: 150,
        description: 'A bunkhouse for workers.',
        type: 'housing',
    },
    {
        id: 'condominium',
        name: 'Condominium',
        icon: 'condominium',
        cost: 200,
        description: 'A condominium for families.',
        type: 'housing',
    },
    {
        id: 'country-house',
        name: 'Country House',
        icon: 'country-house',
        cost: 250,
        description: 'A country house for relaxation.',
        type: 'housing',
    },
    {
        id: 'house',
        name: 'House',
        icon: 'house',
        cost: 300,
        description: 'A standard house for living.',
        type: 'housing',
    },
    {
        id: 'luxury-house',
        name: 'Luxury House',
        icon: 'luxury-house',
        cost: 500,
        description: 'A luxury house with premium amenities.',
        type: 'housing',
    },
    {
        id: 'shack',
        name: 'Shack',
        icon: 'shack',
        cost: 50,
        description: 'A simple shack for temporary shelter.',
        type: 'housing',
    },
    {
        id: 'tenement',
        name: 'Tenement',
        icon: 'tenement',
        cost: 400,
        description: 'A tenement building for multiple families.',
        type: 'housing',
    }
];

export const industrialButtonData = [
    {
        id: 'cannery',
        name: 'Cannery',
        icon: 'cannery',
        cost: 300,
        description: 'A factory for processing fruits and vegetables.',
        type: 'industrial',
    },
    {
        id: 'cigar-factory',
        name: 'Cigar Factory',
        icon: 'cigar-factory',
        cost: 400,
        description: 'A factory for producing cigars.',
        type: 'industrial',
    },
    {
        id: 'furniture-factory',
        name: 'Furniture Factory',
        icon: 'furniture-factory',
        cost: 500,
        description: 'A factory for producing furniture.',
        type: 'industrial',
    },
    {
        id: 'jewelry-factory',
        name: 'Jewelry Factory',
        icon: 'jewelry-factory',
        cost: 600,
        description: 'A factory for producing jewelry.',
        type: 'industrial',
    },
    {
        id: 'lumber-mill',
        name: 'Lumber Mill',
        icon: 'lumber-mill',
        cost: 350,
        description: 'A mill for processing lumber.',
        type: 'industrial',
    },
    {
        id: 'rum-distillery',
        name: 'Rum Distillery',
        icon: 'rum-distillery',
        cost: 450,
        description: 'A distillery for producing rum.',
        type: 'industrial',
    }
];

export const farmsAndMinesButtonData = [
    { id: 'farm', name: 'Farm', icon: 'farm', cost: 100, description: "A farm for growing crops.", type: 'farms-and-mines' },
    { id: 'fishermans-wharf', name: "Fisherman's Wharf", icon: 'fishermans-wharf', cost: 120, description: "A wharf for fishing.", type: 'farms-and-mines' },
    { id: 'logging-camp', name: 'Logging Camp', icon: 'logging-camp', cost: 140, description: "A camp for logging.", type: 'farms-and-mines' },
    { id: 'mine', name: 'Mine', icon: 'mine', cost: 200, description: "A mine for extracting resources.", type: 'farms-and-mines' },
    { id: 'ranch', name: 'Ranch', icon: 'ranch', cost: 160, description: "A ranch for raising animals.", type: 'farms-and-mines' },
];

export const touristAttractionsButtonData = [
    { id: 'beach-site', name: 'Beach Site', icon: 'beach-site', cost: 200, description: "A site for beach activities.", type: 'tourist-attractions' },
    { id: 'duty-free-shop', name: 'Duty Free Shop', icon: 'duty-free-shop', cost: 250, description: "A shop for duty free goods.", type: 'tourist-attractions' },
    { id: 'marina', name: 'Marina', icon: 'marina', cost: 300, description: "A marina for boats.", type: 'tourist-attractions' },
    { id: 'miniature-golf', name: 'Miniature Golf', icon: 'miniature-golf', cost: 180, description: "A miniature golf course.", type: 'tourist-attractions' },
    { id: 'nature-preserve', name: 'Nature Preserve', icon: 'nature-preserve', cost: 350, description: "A preserve for nature.", type: 'tourist-attractions' },
    { id: 'pool', name: 'Pool', icon: 'pool', cost: 120, description: "A pool for swimming.", type: 'tourist-attractions' },
    { id: 'scenic-outlook', name: 'Scenic Outlook', icon: 'scenic-outlook', cost: 100, description: "A scenic outlook.", type: 'tourist-attractions' },
    { id: 'souvenir-shop', name: 'Souvenir Shop', icon: 'souvenir-shop', cost: 90, description: "A shop for souvenirs.", type: 'tourist-attractions' },
    { id: 'spa', name: 'Spa', icon: 'spa', cost: 220, description: "A spa for relaxation.", type: 'tourist-attractions' },
    { id: 'tennis-court', name: 'Tennis Court', icon: 'tennis-court', cost: 160, description: "A tennis court.", type: 'tourist-attractions' },
];

export const touristAccommodationsButtonData = [
    { id: 'beach-villa', name: 'Beach Villa', icon: 'beach-villa', cost: 400, description: "A luxury beach villa.", type: 'tourist-accommodations' },
    { id: 'bungalow', name: 'Bungalow', icon: 'bungalow', cost: 180, description: "A small bungalow.", type: 'tourist-accommodations' },
    { id: 'cheap-motel', name: 'Cheap Motel', icon: 'cheap-motel', cost: 120, description: "A cheap motel.", type: 'tourist-accommodations' },
    { id: 'hotel', name: 'Hotel', icon: 'hotel', cost: 250, description: "A standard hotel.", type: 'tourist-accommodations' },
    { id: 'luxury-hotel', name: 'Luxury Hotel', icon: 'luxury-hotel', cost: 500, description: "A luxury hotel.", type: 'tourist-accommodations' },
];

export const entertainmentButtonData = [
    { id: 'archaeological-site', name: 'Archaeological site', icon: 'archaeological-site', cost: 300, description: "A site for archaeology.", type: 'entertainment' },
    { id: 'cabaret', name: 'Cabaret', icon: 'cabaret', cost: 200, description: "A cabaret for shows.", type: 'entertainment' },
    { id: 'casino', name: 'Casino', icon: 'casino', cost: 350, description: "A casino for gambling.", type: 'entertainment' },
    { id: 'conservatory', name: 'Conservatory', icon: 'conservatory', cost: 400, description: "A conservatory for music.", type: 'entertainment' },
    { id: 'el-prez-home', name: "El Prez' Childhood Home", icon: 'el-prez-home', cost: 500, description: "El Presidente's childhood home.", type: 'entertainment' },
    { id: 'gourmet-restaurant', name: 'Gourmet Restaurant', icon: 'gourmet-restaurant', cost: 250, description: "A gourmet restaurant.", type: 'entertainment' },
    { id: 'movie-theater', name: 'Movie Theater', icon: 'movie-theater', cost: 300, description: "A movie theater.", type: 'entertainment' },
    { id: 'nightclub', name: 'Nightclub', icon: 'nightclub', cost: 220, description: "A nightclub for dancing.", type: 'entertainment' },
    { id: 'pub', name: 'Pub', icon: 'pub', cost: 100, description: "A pub for drinks.", type: 'entertainment' },
    { id: 'restaurant', name: 'Restaurant', icon: 'restaurant', cost: 180, description: "A restaurant for dining.", type: 'entertainment' },
    { id: 'sports-complex', name: 'Sports Complex', icon: 'sports-complex', cost: 400, description: "A complex for sports.", type: 'entertainment' },
];

export const infrastructureButtonData = [
    { id: 'airport', name: 'Airport', icon: 'airport', cost: 1000, description: "An airport for travel.", type: 'infrastructure' },
    { id: 'bank', name: 'Bank', icon: 'bank', cost: 600, description: "A bank for finances.", type: 'infrastructure' },
    { id: 'construction-office', name: 'Construction Office', icon: 'construction-office', cost: 200, description: "An office for construction.", type: 'infrastructure' },
    { id: 'electric-power-plant', name: 'Electric Power Plant', icon: 'electric-power-plant', cost: 1200, description: "A plant for electricity.", type: 'infrastructure' },
    { id: 'electric-substation', name: 'Electric Substation', icon: 'electric-substation', cost: 400, description: "A substation for electricity.", type: 'infrastructure' },
    { id: 'dock', name: 'Dock', icon: 'dock', cost: 500, description: "A dock for ships.", type: 'infrastructure' },
    { id: 'teamsters-office', name: "Teamster's Office", icon: 'teamsters-office', cost: 180, description: "An office for teamsters.", type: 'infrastructure' },
];

export const governmentButtonData = [
    { id: 'palace', name: 'Palace', icon: 'palace', cost: 2000, description: "The main palace.", type: 'government' },
    { id: 'armory', name: 'Armory', icon: 'armory', cost: 800, description: "An armory for weapons.", type: 'government' },
    { id: 'army-base', name: 'Army Base', icon: 'army-base', cost: 1500, description: "A base for the army.", type: 'government' },
    { id: 'diplomatic-ministry', name: 'Diplomatic Ministry', icon: 'diplomatic-ministry', cost: 700, description: "A ministry for diplomacy.", type: 'government' },
    { id: 'guard-station', name: 'Guard Station', icon: 'guard-station', cost: 300, description: "A station for guards.", type: 'government' },
    { id: 'immigration-office', name: 'Immigration Office', icon: 'immigration-office', cost: 350, description: "An office for immigration.", type: 'government' },
    { id: 'newspaper', name: 'Newspaper', icon: 'newspaper', cost: 120, description: "A newspaper office.", type: 'government' },
    { id: 'police-station', name: 'Police Station', icon: 'police-station', cost: 400, description: "A police station.", type: 'government' },
    { id: 'prison', name: 'Prison', icon: 'prison', cost: 600, description: "A prison.", type: 'government' },
    { id: 'radio-station', name: 'Radio Station', icon: 'radio-station', cost: 200, description: "A radio station.", type: 'government' },
    { id: 'tv-station', name: 'TV Station', icon: 'tv-station', cost: 300, description: "A TV station.", type: 'government' },
];

export const humanServicesButtonData = [
    { id: 'cathedral', name: 'Cathedral', icon: 'cathedral', cost: 800, description: "A cathedral for worship.", type: 'human-services' },
    { id: 'church', name: 'Church', icon: 'church', cost: 200, description: "A church for worship.", type: 'human-services' },
    { id: 'clinic', name: 'Clinic', icon: 'clinic', cost: 150, description: "A clinic for health.", type: 'human-services' },
    { id: 'college', name: 'College', icon: 'college', cost: 600, description: "A college for education.", type: 'human-services' },
    { id: 'high-school', name: 'High School', icon: 'high-school', cost: 300, description: "A high school for education.", type: 'human-services' },
    { id: 'hospital', name: 'Hospital', icon: 'hospital', cost: 900, description: "A hospital for health.", type: 'human-services' },
    { id: 'marketplace', name: 'Marketplace', icon: 'marketplace', cost: 120, description: "A marketplace for goods.", type: 'human-services' },
];

export const landscapeButtonData = [
    { id: 'bushes-shrubs', name: 'Bushes and Shrubs', icon: 'bushes-shrubs', cost: 20, description: "Decorative bushes and shrubs.", type: 'landscape' },
    { id: 'large-fountain', name: 'Large Fountain', icon: 'large-fountain', cost: 150, description: "A large fountain.", type: 'landscape' },
    { id: 'small-fountain', name: 'Small Fountain', icon: 'small-fountain', cost: 80, description: "A small fountain.", type: 'landscape' },
    { id: 'statue', name: 'Statue', icon: 'statue', cost: 100, description: "A decorative statue.", type: 'landscape' },
];


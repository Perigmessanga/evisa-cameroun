"""
Utilitaires pour la gestion des noms de pays (Français/Anglais).
"""

COUNTRY_MAPPING = {
    'Allemagne': ['Germany', 'Deutschland'],
    'Belgique': ['Belgium', 'Belgie'],
    'Chine': ['China'],
    'États-Unis': ['USA', 'United States', 'US', 'Etats-Unis', 'United States of America', 'U.S.A.'],
    'Royaume-Uni': ['UK', 'United Kingdom', 'Great Britain', 'Angleterre', 'England'],
    'Afrique du Sud': ['South Africa'],
    'Côte d\'Ivoire': ['Ivory Coast', 'Cote d\'Ivoire', 'Ivory Coast'],
    'Italie': ['Italy', 'Italia'],
    'Espagne': ['Spain', 'España', 'Espana'],
    'Brésil': ['Brazil', 'Brasil'],
    'Russie': ['Russia', 'Russian Federation'],
    'Japon': ['Japan'],
    'Suisse': ['Switzerland', 'Swiss', 'Suiza'],
    'Pays-Bas': ['Netherlands', 'Holland', 'Pays Bas'],
    'Maroc': ['Morocco'],
    'Tunisie': ['Tunisia'],
    'Égypte': ['Egypt', 'Egypte'],
    'Turquie': ['Turkey', 'Türkiye'],
    'Émirats Arabes Unis': ['UAE', 'United Arab Emirates', 'Emirats Arabes Unis'],
    'Arabie Saoudite': ['Saudi Arabia'],
    'Congo (Brazzaville)': ['Congo', 'Republic of the Congo'],
    'Éthiopie': ['Ethiopia', 'Ethiopie'],
    'Corée du Sud': ['South Korea', 'Korea, South', 'Republic of Korea'],
    'Algérie': ['Algeria', 'Algerie'],
    'Guinée Équatoriale': ['Equatorial Guinea', 'Guinee Equatoriale'],
    'Canada': ['Canada'],
    'Nigeria': ['Nigeria'],
    'Sénégal': ['Senegal'],
    'Gabon': ['Gabon'],
    'Inde': ['India'],
}

def get_country_variants(country_name):
    """Retourne une liste de variantes (Fr/En) pour un nom de pays donné."""
    if not country_name:
        return []
        
    country_name = country_name.strip()
    variants = [country_name]
    
    # Si c'est une clé française
    if country_name in COUNTRY_MAPPING:
        variants.extend(COUNTRY_MAPPING[country_name])
    
    # Chercher si c'est une valeur anglaise pour une clé française
    for fr_name, en_names in COUNTRY_MAPPING.items():
        if country_name in en_names:
            variants.append(fr_name)
            variants.extend(en_names)
            break
            
    # Nettoyage et dédoublonnage
    return list(set([v.strip() for v in variants if v]))

// Utilities for normalizing real database kitten records & providing authentic cattery photography

export const CATTERY_PHOTOS = {
  heroPrimary:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777645486/kittens/kitten-1777645486695-426017939.jpg',
  heroSecondary:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777643893/kittens/kitten-1777643893506-727586412.jpg',
  heroTertiary:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777505051/kittens/kitten-1777505050871-779943822.jpg',
  heroQuaternary:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777644978/kittens/kitten-1777644978498-889408514.jpg',
  editorialCuddle:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777645487/kittens/kitten-1777645486875-230737451.jpg',
  editorialGolden:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777643893/kittens/kitten-1777643893776-85415349.jpg',
  editorialWhite:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777643315/kittens/kitten-1777643315089-748454842.jpg',
  editorialTabby:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777493646/kittens/kitten-1777493644980-627635366.jpg',
  editorialLounge:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777507211/kittens/kitten-1777507211200-719058319.jpg',
  editorialPlayful:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777505788/kittens/kitten-1777505788618-671107571.jpg',
  editorialPortrait:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777644978/kittens/kitten-1777644978766-511031962.jpg',
  editorialNursery:
    'https://res.cloudinary.com/ddrmn3ezq/image/upload/v1777645487/kittens/kitten-1777645487089-749736708.jpg',
};

/**
 * Formats kitten age from either `kitten.age` string or `kitten.ageWeeks` number.
 */
export function formatKittenAge(kitten) {
  if (!kitten) return 'Ready Now';
  if (
    kitten.age &&
    String(kitten.age).trim() &&
    String(kitten.age) !== 'undefined'
  ) {
    return String(kitten.age).trim();
  }
  if (
    kitten.ageWeeks !== undefined &&
    kitten.ageWeeks !== null &&
    kitten.ageWeeks !== ''
  ) {
    return `${kitten.ageWeeks} Weeks`;
  }
  return 'Ready Now';
}

/**
 * Extracts and normalizes specs from either the Mongoose object shape
 * (`{ coatType, eyeColor, weight, hypoallergenic, legType, pattern }`)
 * or legacy array shape (`[{ label, value }]`), plus `dob` and `lineage`.
 */
export function normalizeKittenSpecs(kitten) {
  const cleanedSpecs = [];

  if (Array.isArray(kitten?.specs)) {
    kitten.specs.forEach((s) => {
      if (s && s.label && s.value) {
        cleanedSpecs.push({
          label: String(s.label).trim(),
          value: String(s.value).trim(),
        });
      }
    });
  } else if (kitten?.specs && typeof kitten.specs === 'object') {
    const mapObj = [
      { key: 'coatType', label: 'Coat Texture' },
      { key: 'pattern', label: 'Coat Pattern' },
      { key: 'eyeColor', label: 'Eye Colour' },
      { key: 'weight', label: 'Current Weight' },
      { key: 'legType', label: 'Stance / Leg Style' },
      { key: 'hypoallergenic', label: 'Shedding Profile' },
    ];
    mapObj.forEach(({ key, label }) => {
      const val = kitten.specs[key];
      if (val && String(val).trim()) {
        cleanedSpecs.push({ label, value: String(val).trim() });
      }
    });
  }

  if (kitten?.dob && String(kitten.dob).trim()) {
    cleanedSpecs.push({
      label: 'Date of Birth',
      value: String(kitten.dob).trim(),
    });
  }

  if (kitten?.lineage && typeof kitten.lineage === 'object') {
    if (
      kitten.lineage.sire &&
      !String(kitten.lineage.sire).toLowerCase().includes('confirm')
    ) {
      cleanedSpecs.push({
        label: 'Sire (Father)',
        value: String(kitten.lineage.sire).trim(),
      });
    }
    if (
      kitten.lineage.dam &&
      !String(kitten.lineage.dam).toLowerCase().includes('confirm')
    ) {
      cleanedSpecs.push({
        label: 'Dam (Mother)',
        value: String(kitten.lineage.dam).trim(),
      });
    }
    if (
      kitten.lineage.registry &&
      !String(kitten.lineage.registry).toLowerCase().includes('verify')
    ) {
      cleanedSpecs.push({
        label: 'Pedigree Registry',
        value: String(kitten.lineage.registry).trim(),
      });
    }
  }

  const findSpec = (keywords) => {
    const match = cleanedSpecs.find((s) =>
      keywords.some((kw) => s.label.toLowerCase().includes(kw.toLowerCase()))
    );
    return match ? match.value : null;
  };

  return {
    all: cleanedSpecs,
    color: findSpec(['coat color', 'color', 'coat pattern']) || kitten?.coat || null,
    eyeColor: findSpec(['eye color', 'eye colour', 'eyes']) || null,
    earType: findSpec(['ear type', 'ears']) || null,
    legStyle: findSpec(['leg style', 'leg length', 'stance', 'legs']) || null,
    temperament: findSpec(['temperament', 'personality']) || kitten?.trait || null,
    weight: findSpec(['weight']) || null,
    dob: findSpec(['dob', 'birth']) || kitten?.dob || null,
  };
}

/**
 * Formats the badge trait, short summary, full description, and ordered images (up to 10).
 */
export function getKittenPresentation(kitten) {
  if (!kitten) {
    return {
      ageLabel: 'Ready Now',
      badgeLabel: 'Munchkin Companion',
      subtitle: '',
      shortDescription: '',
      description: '',
      specs: normalizeKittenSpecs(null),
      primaryImage: CATTERY_PHOTOS.heroPrimary,
      secondaryImage: null,
      images: [CATTERY_PHOTOS.heroPrimary],
    };
  }

  const ageLabel = formatKittenAge(kitten);
  const specs = normalizeKittenSpecs(kitten);
  const rawTrait = String(kitten.trait || '').trim();
  const rawShortDesc = String(kitten.shortDescription || '').trim();
  const rawDesc = String(kitten.description || '').trim();

  const isLongTraitBio = rawTrait.length > 42;
  const isNumericRef = /^\d{3,6}$/.test(rawTrait);

  let badgeLabel = 'Home-Raised Munchkin';
  if (!isLongTraitBio && rawTrait) {
    badgeLabel = isNumericRef ? `Ref #${rawTrait}` : rawTrait;
  } else if (specs.legStyle) {
    badgeLabel = specs.legStyle;
  } else if (kitten.breed) {
    badgeLabel = kitten.breed;
  }

  let description = rawDesc;
  if (!description && isLongTraitBio) {
    description = rawTrait;
  }
  if (!description) {
    description = `${kitten.name} is an affectionate ${ageLabel.toLowerCase()} old ${kitten.gender ? kitten.gender.toLowerCase() : ''
      } ${kitten.breed || 'Munchkin'} kitten dressed in a ${(kitten.coat || 'plush').toLowerCase()
      } coat, raised indoors with daily socialization and complete veterinary care.`;
  }

  let rawImages =
    Array.isArray(kitten.images) && kitten.images.length > 0
      ? kitten.images.filter(Boolean).slice(0, 10)
      : kitten.img
        ? [kitten.img]
        : [CATTERY_PHOTOS.heroPrimary];

  if (
    kitten.primaryImage &&
    rawImages.includes(kitten.primaryImage) &&
    rawImages[0] !== kitten.primaryImage
  ) {
    rawImages = [
      kitten.primaryImage,
      ...rawImages.filter((u) => u !== kitten.primaryImage),
    ];
  }

  const subtitleParts = [
    kitten.breed,
    kitten.gender,
    ageLabel,
    kitten.coat,
  ].filter(Boolean);

  return {
    ageLabel,
    badgeLabel,
    subtitle: subtitleParts.join(' · '),
    shortDescription: rawShortDesc || description.split('\n')[0],
    description,
    specs,
    primaryImage: rawImages[0],
    secondaryImage: rawImages.length > 1 ? rawImages[1] : null,
    images: rawImages,
  };
}

import { createLevelAuthoring } from './lib/curated-level-authoring.mjs';
export const author = createLevelAuthoring('B1');
// The activity suffix is distinct from the A1 lexical noun 中 (なか).
author.forms['中']=['ちゅう','during; an activity or state in progress'];
await (await import('./lib/curated-b1-housing.mjs')).authorHousing(author);
await (await import('./lib/curated-b1-household.mjs')).authorHousehold(author);
await (await import('./lib/curated-b1-money.mjs')).authorMoney(author);
await (await import('./lib/curated-b1-clothing.mjs')).authorClothing(author);
await (await import('./lib/curated-b1-shopping.mjs')).authorShopping(author);
await (await import('./lib/curated-b1-work.mjs')).authorWork(author);
await (await import('./lib/curated-b1-sports.mjs')).authorSports(author);
await (await import('./lib/curated-b1-education.mjs')).authorEducation(author);
await (await import('./lib/curated-b1-language.mjs')).authorLanguage(author);
await (await import('./lib/curated-b1-cooking.mjs')).authorCooking(author);
await (await import('./lib/curated-b1-travel.mjs')).authorTravel(author);
await (await import('./lib/curated-b1-health.mjs')).authorHealth(author);
await (await import('./lib/curated-b1-technology.mjs')).authorTechnology(author);
await (await import('./lib/curated-b1-post.mjs')).authorPost(author);
await (await import('./lib/curated-b1-weather.mjs')).authorWeather(author);
await (await import('./lib/curated-b1-landscape.mjs')).authorLandscape(author);
await (await import('./lib/curated-b1-directions.mjs')).authorDirections(author);
await (await import('./lib/curated-b1-driving.mjs')).authorDriving(author);
await (await import('./lib/curated-b1-plants.mjs')).authorPlants(author);
await (await import('./lib/curated-b1-animals.mjs')).authorAnimals(author);
await (await import('./lib/curated-b1-relationships.mjs')).authorRelationships(author);
await (await import('./lib/curated-b1-visits.mjs')).authorVisits(author);
await (await import('./lib/curated-b1-feelings.mjs')).authorFeelings(author);
await (await import('./lib/curated-b1-music.mjs')).authorMusic(author);
await (await import('./lib/curated-b1-theatre.mjs')).authorTheatre(author);
await (await import('./lib/curated-b1-art.mjs')).authorArt(author);
await (await import('./lib/curated-b1-reading.mjs')).authorReading(author);
await (await import('./lib/curated-b1-news.mjs')).authorNews(author);
await (await import('./lib/curated-b1-discussion.mjs')).authorDiscussion(author);
await (await import('./lib/curated-b1-paperwork.mjs')).authorPaperwork(author);
await (await import('./lib/curated-b1-rules.mjs')).authorRules(author);
await (await import('./lib/curated-b1-time.mjs')).authorTime(author);
await (await import('./lib/curated-b1-safety.mjs')).authorSafety(author);
await (await import('./lib/curated-b1-leisure.mjs')).authorLeisure(author);
await (await import('./lib/curated-b1-materials.mjs')).authorMaterials(author);
await (await import('./lib/curated-b1-science.mjs')).authorScience(author);
await (await import('./lib/curated-b1-science-details.mjs')).authorScienceDetails(author);
await (await import('./lib/curated-b1-daily-details.mjs')).authorDailyDetails(author);
await (await import('./lib/curated-b1-study-details.mjs')).authorStudyDetails(author);
await (await import('./lib/curated-b1-journeys-details.mjs')).authorJourneysDetails(author);
await (await import('./lib/curated-b1-public-details.mjs')).authorPublicDetails(author);
await (await import('./lib/curated-b1-people-details.mjs')).authorPeopleDetails(author);
await (await import('./lib/curated-b1-culture-details.mjs')).authorCultureDetails(author);
await (await import('./lib/curated-b1-body-details.mjs')).authorBodyDetails(author);
await (await import('./lib/curated-b1-observation-details.mjs')).authorObservationDetails(author);
await (await import('./lib/curated-b1-civic-details.mjs')).authorCivicDetails(author);
await (await import('./lib/curated-b1-language-details.mjs')).authorLanguageDetails(author);
await (await import('./lib/curated-b1-outdoors-details.mjs')).authorOutdoorsDetails(author);
await (await import('./lib/curated-b1-relationships-details.mjs')).authorRelationshipsDetails(author);
await (await import('./lib/curated-b1-work-details.mjs')).authorWorkDetails(author);
await (await import('./lib/curated-b1-practical-details.mjs')).authorPracticalDetails(author);
await (await import('./lib/curated-b1-places-details.mjs')).authorPlacesDetails(author);
await (await import('./lib/curated-b1-arts-details.mjs')).authorArtsDetails(author);
await (await import('./lib/curated-b1-geometry-details.mjs')).authorGeometryDetails(author);
await (await import('./lib/curated-b1-body-movement.mjs')).authorBodyMovement(author);
await (await import('./lib/curated-b1-administration-details.mjs')).authorAdministrationDetails(author);
await (await import('./lib/curated-b1-social-details.mjs')).authorSocialDetails(author);
await (await import('./lib/curated-b1-workplace-systems.mjs')).authorWorkplaceSystems(author);
await (await import('./lib/curated-b1-living-world.mjs')).authorLivingWorld(author);
await (await import('./lib/curated-b1-home-actions.mjs')).authorHomeActions(author);
await (await import('./lib/curated-b1-stories-beliefs.mjs')).authorStoriesBeliefs(author);
await (await import('./lib/curated-b1-health-routines.mjs')).authorHealthRoutines(author);

await (await import('./lib/curated-b1-getting-around.mjs')).authorGettingAround(author);

await (await import('./lib/curated-b1-family-lives.mjs')).authorFamilyLives(author);

await (await import('./lib/curated-b1-work-responsibilities.mjs')).authorWorkResponsibilities(author);

await (await import('./lib/curated-b1-public-responses.mjs')).authorPublicResponses(author);

await (await import('./lib/curated-b1-object-actions.mjs')).authorObjectActions(author);

await (await import('./lib/curated-b1-reading-and-performance.mjs')).authorReadingAndPerformance(author);

await (await import('./lib/curated-b1-field-study.mjs')).authorFieldStudy(author);

await (await import('./lib/curated-b1-reactions-and-repair.mjs')).authorReactionsAndRepair(author);

await (await import('./lib/curated-b1-work-plans.mjs')).authorWorkPlans(author);

await (await import('./lib/curated-b1-home-details.mjs')).authorHomeDetails(author);

await (await import('./lib/curated-b1-science-processes.mjs')).authorScienceProcesses(author);

await (await import('./lib/curated-b1-motion-and-energy.mjs')).authorMotionAndEnergy(author);

await (await import('./lib/curated-b1-rural-landscapes.mjs')).authorRuralLandscapes(author);

await (await import('./lib/curated-b1-claims-and-judgment.mjs')).authorClaimsAndJudgment(author);

await (await import('./lib/curated-b1-kitchen-storage.mjs')).authorKitchenStorage(author);

author.finish();
if(!process.argv.includes('--tracks-draft'))await import('./compile-curated-catalog.mjs');

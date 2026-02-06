INSERT INTO "Users" (
  id, name, email, password, streak, "lastReviewAt", points, frozen, "createdAt", "updatedAt"
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Demo User',
  'demo@example.com',
  'secret45',
  5,
  NOW() - INTERVAL '1 day',
  300,
  false,
  NOW(),
  NOW()
);

INSERT INTO
    "Languages" (
        id,
        title,
        code,
        symbol,
        "createdAt",
        "updatedAt"
    )
VALUES (
        '22222222-2222-2222-2222-222222222222',
        'English',
        'en',
        '🇬🇧',
        NOW(),
        NOW()
    );

INSERT INTO
    "Sections" (
        id,
        title,
        "languageId",
        "userId",
        "createdAt",
        "updatedAt"
    )
VALUES (
        '33333333-3333-3333-3333-333333333331',
        'Basics',
        '22222222-2222-2222-2222-222222222222',
        'b0320dc6-e2a4-475e-a331-38549695695a',
        NOW(),
        NOW()
    ),
    (
        '33333333-3333-3333-3333-333333333332',
        'Food',
        '22222222-2222-2222-2222-222222222222',
        'b0320dc6-e2a4-475e-a331-38549695695a',
        NOW(),
        NOW()
    );

INSERT INTO
    "Groups" (
        id,
        title,
        "sectionId",
        "createdAt",
        "updatedAt"
    )
VALUES (
        '44444444-4444-4444-4444-444444444441',
        'Basic words',
        '33333333-3333-3333-3333-333333333331',
        NOW(),
        NOW()
    ),
    (
        '44444444-4444-4444-4444-444444444442',
        'Food words',
        '33333333-3333-3333-3333-333333333332',
        NOW(),
        NOW()
    );

INSERT INTO
    "Images" (id, url)
VALUES (
        '55555555-5555-5555-5555-555555555555',
        'https://example.com/default.png'
    );

INSERT INTO "Cards" (
  id, word, "translateWord", "groupId", "imageId",
  status, definition, example,
  "learnedAt", "nextReviewAt", "reviewCount",
  "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  'basic_' || i,
  'базове_' || i,
  '44444444-4444-4444-4444-444444444441',
  '55555555-5555-5555-5555-555555555555',
  (
  CASE WHEN i <= 10 THEN 'Learned' ELSE 'To Learn' END
)::"enum_Cards_status",
  'Definition ' || i,
  'Example ' || i,
  CASE WHEN i <= 10 THEN NOW() - INTERVAL '2 months' ELSE NULL END,
  CASE WHEN i <= 10 THEN CURRENT_DATE ELSE NULL END,
  CASE WHEN i <= 10 THEN 5 ELSE 0 END,
  NOW(),
  NOW()
FROM generate_series(1,20) i;

INSERT INTO "Cards" (
  id, word, "translateWord", "groupId", "imageId",
  status, definition, example,
  "learnedAt", "nextReviewAt", "reviewCount",
  "createdAt", "updatedAt"
)
SELECT
  gen_random_uuid(),
  'food_' || i,
  'їжа_' || i,
  '44444444-4444-4444-4444-444444444442',
  '55555555-5555-5555-5555-555555555555',
  (
  CASE WHEN i <= 10 THEN 'Learned' ELSE 'To Learn' END
)::"enum_Cards_status",
  'Food definition ' || i,
  'Food example ' || i,
  CASE WHEN i <= 10 THEN NOW() - INTERVAL '1 month' ELSE NULL END,
  CASE WHEN i <= 10 THEN CURRENT_DATE ELSE NULL END,
  CASE WHEN i <= 10 THEN 3 ELSE 0 END,
  NOW(),
  NOW()
FROM generate_series(1,20) i;

INSERT INTO
    "Results" (
        id,
        title,
        "userId",
        "startedLearn",
        "completionTime",
        "createdAt",
        "updatedAt"
    )
VALUES (
        '77777777-7777-7777-7777-777777777771',
        'January session',
        'b0320dc6-e2a4-475e-a331-38549695695a',
        NOW() - INTERVAL '3 months',
        NOW() - INTERVAL '3 months' + INTERVAL '15 minutes',
        NOW(),
        NOW()
    ),
    (
        '77777777-7777-7777-7777-777777777772',
        'February session',
        'b0320dc6-e2a4-475e-a331-38549695695a',
        NOW() - INTERVAL '2 months',
        NOW() - INTERVAL '2 months' + INTERVAL '20 minutes',
        NOW(),
        NOW()
    ),
    (
        '77777777-7777-7777-7777-777777777773',
        'March session',
        'b0320dc6-e2a4-475e-a331-38549695695a',
        NOW() - INTERVAL '1 month',
        NOW() - INTERVAL '1 month' + INTERVAL '10 minutes',
        NOW(),
        NOW()
    );

INSERT INTO
    "ResultsMode" (
        id,
        mode,
        "resultId",
        "createdAt",
        "updatedAt"
    )
VALUES (
        gen_random_uuid (),
        'flashCards',
        '77777777-7777-7777-7777-777777777771',
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid (),
        'quiz',
        '77777777-7777-7777-7777-777777777772',
        NOW(),
        NOW()
    ),
    (
        gen_random_uuid (),
        'check',
        '77777777-7777-7777-7777-777777777773',
        NOW(),
        NOW()
    );

INSERT INTO
    "WordsResult" (
        id,
        "resultModeId",
        word,
        translate,
        "mistakesAmount",
        "createdAt",
        "updatedAt"
    )
SELECT
    gen_random_uuid (),
    rm.id,
    'word_' || i,
    'слово_' || i,
    (i % 2),
    NOW(),
    NOW()
FROM "ResultsMode" rm
    CROSS JOIN generate_series (1, 5) i;
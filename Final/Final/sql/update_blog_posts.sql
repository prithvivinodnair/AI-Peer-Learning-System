-- Disable safe update mode
SET SQL_SAFE_UPDATES = 0;

-- Delete all records from blog_posts table
DELETE FROM blog_posts;

-- Insert new records with working online URLs and images
INSERT INTO blog_posts (title, url, image_url, created_at) VALUES
('10 Tips to Improve Your Fitness', 'https://www.healthline.com/nutrition/10-tips-to-improve-your-fitness', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', NOW()),
('Best Pre-Workout Meals', 'https://www.menshealth.com/nutrition/a19548010/best-pre-workout-meals/', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', NOW()),
('Hydration Myths Busted', 'https://www.webmd.com/diet/features/water-myths', 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800', NOW()),
('How to Start Running', 'https://www.runnersworld.com/beginners/a20803133/how-to-start-running/', 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=800', NOW()),
('Top 5 Recovery Tools', 'https://www.self.com/story/best-recovery-tools', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', NOW()),
('Boost Strength Fast', 'https://www.bodybuilding.com/content/boost-your-strength-fast.html', 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800', NOW()),
('Sports Nutrition 101', 'https://www.eatright.org/fitness/sports-and-performance', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', NOW()),
('Home Workout Guide', 'https://www.verywellfit.com/best-home-workout-4157084', 'https://images.unsplash.com/photo-1517960413843-0aee8e2d7e58?w=800', NOW()),
('Benefits of Yoga', 'https://www.yogajournal.com/lifestyle/benefits-of-yoga/', 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800', NOW()),
('Improve Flexibility', 'https://www.healthline.com/health/how-to-improve-flexibility', 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800', NOW());

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"listing_type" varchar NOT NULL,
	"listing_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "internships" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"location" varchar,
	"address" varchar(255),
	"city" varchar,
	"state" varchar,
	"zipcode" varchar,
	"is_remote" boolean DEFAULT false,
	"types" text[],
	"selectivity_level" integer,
	"compensation" varchar,
	"description" text,
	"duration" text[],
	"internship_dates" text,
	"length" varchar(100),
	"delivery_mode" text[],
	"minimum_age" integer,
	"application_open" date,
	"application_deadline" date,
	"prerequisites" text,
	"tuition" varchar,
	"eligibility" text,
	"website" varchar,
	"has_mentorship" boolean DEFAULT false,
	"is_approved" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"submitted_at" timestamp DEFAULT now(),
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"photo_url" varchar
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"location" varchar,
	"address" varchar(255),
	"city" varchar,
	"state" varchar,
	"zipcode" varchar,
	"is_remote" boolean DEFAULT false,
	"categories" text[],
	"compensation" varchar,
	"compensation_range" varchar,
	"salary_min" numeric(10, 2),
	"salary_max" numeric(10, 2),
	"salary_type" varchar,
	"job_type" text[],
	"description" text,
	"work_schedule" text,
	"schedule" text[],
	"minimum_age" integer,
	"opening_date" date,
	"closing_date" date,
	"is_ongoing" boolean DEFAULT false,
	"application_deadline" date,
	"eligibility" text,
	"website" varchar,
	"has_training" boolean DEFAULT false,
	"has_advancement" boolean DEFAULT false,
	"requires_transportation" boolean DEFAULT false,
	"requires_resume" boolean DEFAULT false,
	"is_approved" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"submitted_at" timestamp DEFAULT now(),
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"photo_url" varchar
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"report_type" varchar NOT NULL,
	"item_type" varchar NOT NULL,
	"item_id" integer NOT NULL,
	"reason" text,
	"description" text,
	"is_resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"listing_type" varchar NOT NULL,
	"listing_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"rating" integer NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "summer_camps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" varchar,
	"address" varchar(255),
	"city" varchar,
	"state" varchar,
	"zipcode" varchar,
	"categories" text[],
	"tags" text[],
	"selectivity_level" integer,
	"dates" text,
	"length" varchar(100),
	"cost_range" varchar(50),
	"application_open" date,
	"application_due_date" date,
	"application_deadline" date,
	"application_available" boolean DEFAULT true,
	"minimum_age" integer,
	"has_scholarship" boolean DEFAULT false,
	"eligibility" text,
	"description" text,
	"delivery_mode" text[],
	"website" varchar,
	"photo_url" varchar,
	"is_approved" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"submitted_at" timestamp DEFAULT now(),
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "thumbs_up" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"listing_type" varchar NOT NULL,
	"listing_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tutoring_providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" text,
	"website" varchar,
	"phone" varchar,
	"email" varchar,
	"address" text,
	"city" varchar,
	"state" varchar,
	"zipcode" varchar,
	"categories" text[],
	"subjects" text[],
	"delivery_mode" text[],
	"photo_url" varchar,
	"is_approved" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"submitted_at" timestamp DEFAULT now(),
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"location" varchar,
	"phone" varchar,
	"school_name" varchar,
	"grade" varchar,
	"address" varchar,
	"role" varchar(20) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");
export interface StrategicOption {
  id: string;
  title: string;
  tagline: string;
  formula: string;
  description: string;
  recommended_for: string;
}

export interface TitleDirection {
  style: 'Curiosity' | 'Transformation' | 'Story-Driven';
  title: string;
  strategy_note: string;
}

export interface ThumbnailConcept {
  visual_description: string;
  overlay_text: string | null;
  why_it_clicks: string;
}

export interface StoryBeat {
  timestamp_or_phase: string;
  beat_title: string;
  narrative_action: string;
}

export interface RefinedConcept {
  real_story_realization: string;
  central_narrative: string;
  elevated_title_directions: TitleDirection[];
  story_hook: {
    script_line: string;
    visual_action: string;
    why_it_works: string;
  };
  the_unexpected_angle: {
    alternate_title: string;
    structure_shift: string;
    why_it_subverts: string;
  };
  cinematic_direction: {
    opening_scene: string;
    visual_language: string[];
    audio_texture: string;
  };
  pacing_structure: StoryBeat[];
  thumbnail_blueprint: ThumbnailConcept;
}

export interface CineraIdeaResponse {
  mode: 'exploration' | 'blueprint';
  collaborative_insight: string;
  strategic_options?: StrategicOption[];
  follow_up_questions?: string[];
  refined_concept?: RefinedConcept | null;
}
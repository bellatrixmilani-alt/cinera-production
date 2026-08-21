export interface ContextSnapshot {
    creatorName: string;
    primaryGenre: string;
    activeProjectTitle?: string;
    recentSparks: string[];
    systemDate: string;
  }
  
  export function formatContextPrompt(snapshot: ContextSnapshot): string {
    return `
  CREATOR CONTEXT:
  - Creator Name: ${snapshot.creatorName}
  - Focus Genre: ${snapshot.primaryGenre}
  ${snapshot.activeProjectTitle ? `- Active Workspace: "${snapshot.activeProjectTitle}"` : ''}
  ${snapshot.recentSparks.length > 0 ? `- Recent Spark Fragments: \n  * ${snapshot.recentSparks.slice(0, 4).join('\n  * ')}` : ''}
  - Anchor Timestamp: ${snapshot.systemDate}
  `;
  }